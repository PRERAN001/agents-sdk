class Input:
    def __init__(
        self,
        type,
        *,
        label=None,
        placeholder=None,
        description=None,
        required=True,
        default=None,
        disabled=False,
        hidden=False,
    ):
        self.type = type
        self.label = label
        self.placeholder = placeholder
        self.description = description
        self.required = required
        self.default = default
        self.disabled = disabled
        self.hidden = hidden


class TextInput(Input):
    def __init__(
        self,
        **kwargs,
    ):
        super().__init__("text", **kwargs)


class TextAreaInput(Input):
    def __init__(
        self,
        rows=5,
        **kwargs,
    ):
        super().__init__("textarea", **kwargs)
        self.rows = rows


class NumberInput(Input):
    def __init__(
        self,
        *,
        min=None,
        max=None,
        step=1,
        **kwargs,
    ):
        super().__init__("number", **kwargs)
        self.min = min
        self.max = max
        self.step = step


class BooleanInput(Input):
    def __init__(self, **kwargs):
        super().__init__("boolean", **kwargs)


class PasswordInput(Input):
    def __init__(self, **kwargs):
        super().__init__("password", **kwargs)


class EmailInput(Input):
    def __init__(self, **kwargs):
        super().__init__("email", **kwargs)


class URLInput(Input):
    def __init__(self, **kwargs):
        super().__init__("url", **kwargs)


class DateInput(Input):
    def __init__(
        self,
        *,
        min=None,
        max=None,
        **kwargs,
    ):
        super().__init__("date", **kwargs)
        self.min = min
        self.max = max


class TimeInput(Input):
    def __init__(self, **kwargs):
        super().__init__("time", **kwargs)


class DateTimeInput(Input):
    def __init__(self, **kwargs):
        super().__init__("datetime", **kwargs)


class FileInput(Input):
    def __init__(
        self,
        *,
        accept=None,
        multiple=False,
        max_size=None,
        **kwargs,
    ):
        super().__init__("file", **kwargs)
        self.accept = accept
        self.multiple = multiple
        self.max_size = max_size


class ImageInput(FileInput):
    def __init__(self, **kwargs):
        super().__init__(
            accept=["image/*"],
            **kwargs,
        )
        self.type = "image"


class AudioInput(FileInput):
    def __init__(self, **kwargs):
        super().__init__(
            accept=["audio/*"],
            **kwargs,
        )
        self.type = "audio"


class VideoInput(FileInput):
    def __init__(self, **kwargs):
        super().__init__(
            accept=["video/*"],
            **kwargs,
        )
        self.type = "video"


class SelectInput(Input):
    def __init__(
        self,
        options,
        *,
        searchable=False,
        **kwargs,
    ):
        super().__init__("select", **kwargs)
        self.options = options
        self.searchable = searchable


class MultiSelectInput(Input):
    def __init__(
        self,
        options,
        *,
        searchable=False,
        **kwargs,
    ):
        super().__init__("multiselect", **kwargs)
        self.options = options
        self.searchable = searchable


class JSONInput(Input):
    def __init__(
        self,
        *,
        schema=None,
        **kwargs,
    ):
        super().__init__("json", **kwargs)
        self.schema = schema