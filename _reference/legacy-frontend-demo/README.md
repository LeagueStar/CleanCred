# Frontend

Run a local static server from this directory, for example:

    python -m http.server 5500

Then open:

    http://127.0.0.1:5500

The frontend calls the FastAPI server at http://127.0.0.1:8000.

For phone camera/GPS testing, a secure HTTPS deployment is recommended. Browsers commonly restrict camera/GPS APIs on insecure origins other than localhost.
