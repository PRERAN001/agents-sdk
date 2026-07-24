class Task:
    def __init__(self, func, name=None):
        self.name = name or func.__name__
        self.func = func