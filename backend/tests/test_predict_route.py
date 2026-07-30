from app.main import app


def test_predict_route_registered_once():
    predict_routes = [
        route for route in app.routes
        if getattr(route, "path", None) == "/predict"
    ]

    assert len(predict_routes) == 1
