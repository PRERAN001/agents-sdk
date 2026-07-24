class Output:
    def __init__(self, type):
        self.type = type


class TextOutput(Output):
    def __init__(self):
        super().__init__("text")


class MarkdownOutput(Output):
    def __init__(self):
        super().__init__("markdown")


class JSONOutput(Output):
    def __init__(self):
        super().__init__("json")


class ImageOutput(Output):
    def __init__(self):
        super().__init__("image")


class FileOutput(Output):
    def __init__(self):
        super().__init__("file")


class AudioOutput(Output):
    def __init__(self):
        super().__init__("audio")


class VideoOutput(Output):
    def __init__(self):
        super().__init__("video")


class HTMLOutput(Output):
    def __init__(self):
        super().__init__("html")


class TableOutput(Output):
    def __init__(self):
        super().__init__("table")


class PDFOutput(Output):
    def __init__(self):
        super().__init__("pdf")


class CSVOutput(Output):
    def __init__(self):
        super().__init__("csv")


class ZIPOutput(Output):
    def __init__(self):
        super().__init__("zip")