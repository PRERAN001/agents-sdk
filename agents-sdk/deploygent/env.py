class Env:

    def __init__(
        self,
        name,
        required=True,
        description=None
    ):
        self.name = name
        self.required = required
        self.description = description