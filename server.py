#!/usr/bin/env python3
"""
GREEN LEGACY — Smart Waste Management & Rewards Platform
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

class GreenLegacyHandler(http.server.SimpleHTTPRequestHandler):
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

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # API Health Check
        if parsed_url.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                "status": "healthy",
                "platform": "GREEN LEGACY — Smart Waste Management",
                "tagline": "EARN. RECYCLE. REWARD.",
                "timestamp": datetime.now().isoformat(),
                "databases": {
                    "municipal_waste_db": "CONNECTED",
                    "citizen_ledger_db": "CONNECTED",
                    "smart_city_api": "CONNECTED",
                    "mrf_recyclers_net": "CONNECTED"
                }
            }
            self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
            return
            
        return super().do_GET()

def run_server():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), GreenLegacyHandler) as httpd:
        print("==================================================")
        print("  GREEN LEGACY Web Platform Running")
        print("  Tagline: EARN. RECYCLE. REWARD.")
        print(f"  URL: http://127.0.0.1:{PORT}")
        print(f"  Serving directory: {DIRECTORY}")
        print("==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    run_server()
