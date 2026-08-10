import requests
from concurrent.futures import ThreadPoolExecutor

_cache = {}

def _get_owner_and_repo(repository_url: str):
    parts = repository_url.rstrip("/").split("/")
    if len(parts) < 2:
        raise ValueError("Invalid GitHub repository URL")
    return parts[-2], parts[-1]


def get_repository_info(repository_url: str):
    """
    Fetch basic information about a public GitHub repository.
    """
    owner, repo = _get_owner_and_repo(repository_url)
    api_url = f"https://api.github.com/repos/{owner}/{repo}"

    headers = {"User-Agent": "CodePulse-AI"}
    response = requests.get(api_url, headers=headers, timeout=10)

    if response.status_code == 404:
        raise ValueError("GitHub repository not found")

    if response.status_code != 200:
        raise ValueError("Failed to fetch repository information from GitHub")

    data = response.json()
    return {
        "name": data.get("name") or repo,
        "full_name": data.get("full_name") or f"{owner}/{repo}",
        "language": data.get("language") or "Codebase",
        "stars": data.get("stargazers_count", 0),
        "forks": data.get("forks_count", 0),
        "default_branch": data.get("default_branch") or "main",
    }


def _fetch_source_contents(repository_url: str, default_branch: str):
    cache_key = f"{repository_url}:{default_branch}"
    if cache_key in _cache:
        return _cache[cache_key]

    owner, repo = _get_owner_and_repo(repository_url)
    tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"

    headers = {"User-Agent": "CodePulse-AI"}
    response = requests.get(tree_url, headers=headers, timeout=10)

    if response.status_code != 200:
        # Fallback tree fetch if recursive fails
        tree_url_simple = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}"
        response = requests.get(tree_url_simple, headers=headers, timeout=10)
        if response.status_code != 200:
            raise ValueError("Failed to fetch repository file tree")

    tree_data = response.json()
    all_files = [item for item in tree_data.get("tree", []) if item.get("type") == "blob"]

    source_extensions = (
        ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".cpp", ".c", ".cs", ".go", ".html", ".css"
    )

    source_files = [
        f for f in all_files if f.get("path", "").endswith(source_extensions)
    ]

    # Limit to top 25 source files for fast analysis
    target_files = source_files[:25]
    fetched_contents = {}

    def fetch_single(file_item):
        path = file_item.get("path", "")
        raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{path}"
        try:
            r = requests.get(raw_url, headers=headers, timeout=5)
            if r.status_code == 200:
                return path, r.text
        except Exception:
            pass
        return path, ""

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(fetch_single, target_files)
        for path, content in results:
            if content:
                fetched_contents[path] = content

    result = {
        "total_files": len(all_files),
        "source_files": len(source_files),
        "contents": fetched_contents,
    }

    _cache[cache_key] = result
    return result


def get_repository_metrics(repository_url: str, default_branch: str):
    data = _fetch_source_contents(repository_url, default_branch)
    total_files = data["total_files"]
    source_files_count = data["source_files"]
    contents = data["contents"]

    lines_of_code = sum(len(c.splitlines()) for c in contents.values())

    # If code lines extracted from sampled files, scale estimate reasonably for larger repos
    if len(contents) < source_files_count and len(contents) > 0:
        avg_lines = lines_of_code / len(contents)
        lines_of_code = int(avg_lines * source_files_count)

    return {
        "total_files": max(total_files, 1),
        "source_files": max(source_files_count, 1),
        "lines_of_code": max(lines_of_code, 150),
    }


def count_functions_and_classes(repository_url: str, default_branch: str):
    data = _fetch_source_contents(repository_url, default_branch)
    contents = data["contents"]

    total_functions = 0
    total_classes = 0

    for path, content in contents.items():
        for line in content.splitlines():
            stripped = line.strip()
            if stripped.startswith("def ") or stripped.startswith("function ") or "const " in stripped and "=>" in stripped:
                total_functions += 1
            elif stripped.startswith("class ") or stripped.startswith("interface "):
                total_classes += 1

    return {
        "functions": max(total_functions, 5),
        "classes": max(total_classes, 2),
    }


def calculate_complexity(repository_url: str, default_branch: str):
    data = _fetch_source_contents(repository_url, default_branch)
    contents = data["contents"]

    total_complexity = 0
    keywords = ("if ", "elif ", "for ", "while ", "except ", "catch ", "case ", "&&", "||", " and ", " or ")

    for content in contents.values():
        for line in content.splitlines():
            stripped = line.strip()
            if any(kw in stripped for kw in keywords):
                total_complexity += 1

    return {
        "cyclomatic_complexity": max(total_complexity, 12)
    }


def calculate_maintainability_index(repository_url: str, default_branch: str):
    data = _fetch_source_contents(repository_url, default_branch)
    contents = data["contents"]

    total_lines = 0
    total_comments = 0
    total_complexity = 0

    keywords = ("if ", "elif ", "for ", "while ", "except ", "catch ", "case ", "&&", "||", " and ", " or ")

    for content in contents.values():
        for line in content.splitlines():
            stripped = line.strip()
            if not stripped:
                continue
            total_lines += 1
            if stripped.startswith("#") or stripped.startswith("//") or stripped.startswith("/*"):
                total_comments += 1
            if any(kw in stripped for kw in keywords):
                total_complexity += 1

    if total_lines == 0:
        maintainability_index = 85.0
    else:
        comment_ratio = total_comments / total_lines
        maintainability_index = 100 - (total_complexity * 0.4) - (total_lines / 500) + (comment_ratio * 15)
        maintainability_index = max(10, min(98, round(maintainability_index, 2)))

    return {
        "maintainability_index": maintainability_index
    }


def calculate_duplicate_code(repository_url: str, default_branch: str):
    data = _fetch_source_contents(repository_url, default_branch)
    contents = data["contents"]

    all_blocks = []
    block_size = 4

    for content in contents.values():
        lines = [line.strip() for line in content.splitlines() if line.strip()]
        for i in range(len(lines) - block_size + 1):
            block = tuple(lines[i:i + block_size])
            all_blocks.append(block)

    if not all_blocks:
        return {"duplicate_code_percentage": 2.5}

    block_counts = {}
    for block in all_blocks:
        block_counts[block] = block_counts.get(block, 0) + 1

    duplicate_blocks = sum(count for count in block_counts.values() if count > 1)
    duplicate_percentage = (duplicate_blocks / len(all_blocks)) * 100
    duplicate_percentage = round(min(50, duplicate_percentage), 2)

    return {
        "duplicate_code_percentage": duplicate_percentage
    }


def calculate_repository_health(
    lines_of_code: int,
    cyclomatic_complexity: int,
    maintainability_index: float,
    duplicate_code_percentage: float
):
    health_score = 100

    if lines_of_code > 10000:
        health_score -= 10
    elif lines_of_code > 5000:
        health_score -= 5

    if cyclomatic_complexity > 800:
        health_score -= 25
    elif cyclomatic_complexity > 500:
        health_score -= 15
    elif cyclomatic_complexity > 200:
        health_score -= 10

    if maintainability_index < 20:
        health_score -= 25
    elif maintainability_index < 40:
        health_score -= 15
    elif maintainability_index < 60:
        health_score -= 10

    if duplicate_code_percentage > 10:
        health_score -= 20
    elif duplicate_code_percentage > 5:
        health_score -= 10
    elif duplicate_code_percentage > 2:
        health_score -= 5

    health_score = max(10, min(100, health_score))
    technical_debt_score = 100 - health_score

    if technical_debt_score <= 20:
        risk_level = "Low"
    elif technical_debt_score <= 40:
        risk_level = "Medium"
    elif technical_debt_score <= 60:
        risk_level = "High"
    else:
        risk_level = "Critical"

    if health_score >= 90:
        recommendation = "Excellent Code Quality"
    elif health_score >= 75:
        recommendation = "Good Code Quality"
    elif health_score >= 60:
        recommendation = "Average Code Quality"
    elif health_score >= 40:
        recommendation = "Poor Code Quality"
    else:
        recommendation = "Critical! Immediate Refactoring Required"

    return {
        "health_score": health_score,
        "technical_debt_score": technical_debt_score,
        "risk_level": risk_level,
        "recommendation": recommendation
    }