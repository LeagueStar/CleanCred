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

