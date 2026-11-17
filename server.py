#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AS COLLAB - D2C & Amazon Growth Agency
Local Development & Testing Server
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 5055

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and PWA friendly headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.json'):
            return 'application/json; charset=utf-8'
        if path.endswith('.css'):
            return 'text/css; charset=utf-8'
        if path.endswith('.html'):
            return 'text/html; charset=utf-8'
        return super().guess_type(path)

def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print("=" * 65)
        print("🚀 AS COLLAB WEB & MOBILE APP RUNNING LOCALLY")
        print(f"👉 Local URL: http://localhost:{PORT}")
        print("⚡ Press Ctrl+C in terminal to stop server")
        print("=" * 65)
        try:
            webbrowser.open(f"http://localhost:{PORT}")
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")

if __name__ == '__main__':
    run()
