import unittest
from geopy.distance import geodesic

from proximity import within_50_meters


# Each pair starts at (0, 0). The longitude values below were calculated
# against the WGS-84 equatorial circumference and verified with geopy's
# geodesic distance calculation.
DISTANCE_CASES = [
    ((0.0, 0.0), (0.0, 0.00008983152841195215), 10.0, True),
    ((0.0, 0.0), (0.0, 0.00044017448921856556), 49.0, True),
    ((0.0, 0.0), (0.0, 0.000458140794900956), 51.0, False),
    ((0.0, 0.0), (0.0, 0.001796630568239043), 200.0, False),
]


class Within50MetersTests(unittest.TestCase):
    def test_within_50_meters_at_verified_distances(self) -> None:
        """Verify both the known geodesic distance and the 50-meter decision."""
        for origin, destination, expected_distance, expected_result in DISTANCE_CASES:
            with self.subTest(distance_meters=expected_distance):
                self.assertAlmostEqual(
                    geodesic(origin, destination).meters,
                    expected_distance,
                    places=6,
                )
                self.assertIs(
                    within_50_meters(origin, destination),
                    expected_result,
                )
