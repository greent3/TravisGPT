from fastapi import Request


def get_client_ip(request: Request):
    return request.client.host