from math import radians, sin, cos, asin, sqrt

def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius = 6371000.0
    p1, p2 = radians(lat1), radians(lat2)
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat / 2) ** 2 + cos(p1) * cos(p2) * sin(dlon / 2) ** 2
    return 2 * earth_radius * asin(sqrt(a))
