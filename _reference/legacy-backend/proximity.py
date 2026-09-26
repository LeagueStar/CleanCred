from geopy.distance import geodesic


def within_50_meters(
    coordinate_a: tuple[float, float], coordinate_b: tuple[float, float]
) -> bool:
    """Return whether two (latitude, longitude) coordinates are at most 50 m apart."""
    return geodesic(coordinate_a, coordinate_b).meters <= 50


if __name__ == "__main__":
    point_a = (28.6139, 77.2090)
    nearby_point = (28.6140, 77.2091)
    distant_point = (28.6200, 77.2200)

    print("Nearby:", within_50_meters(point_a, nearby_point))
    print("Distant:", within_50_meters(point_a, distant_point))
