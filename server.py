#!/usr/bin/env python3
"""
CleanCred — Smart Waste Management
Local Development & REST API Server
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.parse
from datetime import datetime

# Configure UTF-8 for windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8081
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Phase 1 purity catalog. It is intentionally deterministic and offline:
# the same declared material always receives the same explainable score.
PURITY_SCORES = {
    "wet": {
        "Kitchen Vegetable & Fruit Scraps": 96,
        "Cooked Food Waste & Leftovers": 93,
        "Tea Leaves & Coffee Grounds": 95,
        "Garden Trimmings & Fallen Leaves": 94,
    },
    "dry": {
        "Cardboard Shipping Cartons & Paper": 92,
        "PET Water & Soda Bottles": 94,
        "Aluminium & Steel Beverage Cans": 91,
        "Clean Glass Containers & Jars": 93,
    },
    "harmful": {
        "Used Lithium & Alkaline Batteries": 97,
        "Discarded Electronics & Circuit Boards": 93,
        "Fluorescent Tubes & CFL Bulbs": 90,
        "Expired Domestic Pharmaceutical Medicines": 96,
    },
}


def calculate_purity_score(category, subtype):
    """Return (score, accepted, rationale) for a declared municipal waste stream."""
    category = (category or "").strip().lower()
    subtype = (subtype or "").strip()
    score = PURITY_SCORES.get(category, {}).get(subtype)
    if score is None:
        return 65, False, "Material is outside the supported Phase 1 category catalog."
    return score, score >= 85, "Declared material matches the municipal segregation catalog."

class CleanCredHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if parsed_url.path == '/api/verify-photo':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 16 * 1024:
                self.send_json({"error": "Verification request is too large."}, 413)
                return
            try:
                payload = json.loads(self.rfile.read(content_length).decode('utf-8'))
                score, accepted, rationale = calculate_purity_score(
                    payload.get('category'), payload.get('subtype')
                )
            except (json.JSONDecodeError, UnicodeDecodeError, AttributeError):
                self.send_json({"error": "Send category and subtype as JSON."}, 400)
                return
            self.send_json({
                "segregated": accepted,
                "purity_score": score,
                "result": f"Purity score: {score}% — {'Accepted' if accepted else 'Needs review'}",
                "rationale": rationale,
                "verification_method": "rule-based-phase-1",
            })
            return
        if parsed_url.path == '/api/report_test':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            with open(os.path.join(DIRECTORY, 'test_results.json'), 'wb') as f:
                f.write(body)
            resp_data = b'{"status":"received"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_data)))
            self.end_headers()
            self.wfile.write(resp_data)
            return
        self.send_response(404)
        self.end_headers()

    def send_json(self, data, status=200):
        response = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response)))
        self.end_headers()
        self.wfile.write(response)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # API Health Check
        if parsed_url.path == '/api/health':
            response = {
                "status": "healthy",
                "environment": "local_demo",
                "platform": "CleanCred — Smart Waste Management",
                "tagline": "Verified waste recovery",
                "timestamp": datetime.now().isoformat(),
                "services": {
                    "application": "LOCAL DEMO",
                    "data_store": "Browser Persistence",
                    "municipal_integration": "Prototype",
                    "mrf_network": "Demo Dataset"
                }
            }
            resp_bytes = json.dumps(response, indent=2).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.end_headers()
            self.wfile.write(resp_bytes)
            return
            
        return super().do_GET()

def run_server():
    os.chdir(DIRECTORY)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), CleanCredHandler) as httpd:
        print("==================================================")
        print("  CleanCred Web Platform Running")
        print("  Tagline: Verified waste recovery")
        print(f"  URL: http://127.0.0.1:{PORT}")
        print(f"  Serving directory: {DIRECTORY}")
        print("==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    run_server()

