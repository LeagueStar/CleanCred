"""
CleanCred Geospatial Utilities
Provides spherical distance calculations using the Great-Circle Haversine formula
to enforce municipal proximity hard gates (<= 50 meters) on verification and collection.
"""

from math import radians, sin, cos, asin, sqrt

def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two geographical points on Earth in meters.

    Args:
        lat1 (float): Latitude of point 1 in decimal degrees.
        lon1 (float): Longitude of point 1 in decimal degrees.
        lat2 (float): Latitude of point 2 in decimal degrees.
        lon2 (float): Longitude of point 2 in decimal degrees.

    Returns:
        float: Distance between the two points in meters.
    """
    earth_radius = 6371000.0
    p1, p2 = radians(lat1), radians(lat2)
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat / 2) ** 2 + cos(p1) * cos(p2) * sin(dlon / 2) ** 2
    return 2 * earth_radius * asin(sqrt(a))

