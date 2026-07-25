import socket

START_PORT = 9000
END_PORT = 9999


def get_free_port():
    for port in range(START_PORT, END_PORT + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind(("0.0.0.0", port))
                return port
            except OSError:
                continue

    raise RuntimeError("No free ports available")