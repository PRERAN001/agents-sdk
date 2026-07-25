import socket


def get_free_port():

    with socket.socket() as sock:

        sock.bind(
            ("",0)
        )

        return sock.getsockname()[1]