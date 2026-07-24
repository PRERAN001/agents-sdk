class Input:
    def __init__(self, type, label=None, required=True):
        self.type = type
        self.label = label
        self.required = required


class TextInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("text", label, required)


class TextAreaInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("textarea", label, required)


class NumberInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("number", label, required)


class BooleanInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("boolean", label, required)


class PasswordInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("password", label, required)


class EmailInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("email", label, required)


class URLInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("url", label, required)


class DateInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("date", label, required)


class TimeInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("time", label, required)


class DateTimeInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("datetime", label, required)


class FileInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("file", label, required)


class ImageInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("image", label, required)


class AudioInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("audio", label, required)


class VideoInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("video", label, required)


class SelectInput(Input):
    def __init__(self, options, label=None, required=True):
        super().__init__("select", label, required)
        self.options = options


class MultiSelectInput(Input):
    def __init__(self, options, label=None, required=True):
        super().__init__("multiselect", label, required)
        self.options = options


class JSONInput(Input):
    def __init__(self, label=None, required=True):
        super().__init__("json", label, required)