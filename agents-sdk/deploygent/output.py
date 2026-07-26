class Output:
    def __init__(
        self,
        type,
        *,
        title=None,
        description=None,
        downloadable=False,
        preview=True,
    ):
        self.type = type
        self.title = title
        self.description = description
        self.downloadable = downloadable
        self.preview = preview

    def to_dict(self):
        return self.__dict__


class TextOutput(Output):
    def __init__(self, **kwargs):
        super().__init__("text", **kwargs)


class MarkdownOutput(Output):
    def __init__(self, **kwargs):
        super().__init__("markdown", **kwargs)


class JSONOutput(Output):
    def __init__(
        self,
        *,
        pretty=True,
        collapsible=True,
        **kwargs,
    ):
        super().__init__("json", **kwargs)
        self.pretty = pretty
        self.collapsible = collapsible


class ImageOutput(Output):
    def __init__(
        self,
        *,
        format=None,
        downloadable=True,
        **kwargs,
    ):
        super().__init__(
            "image",
            downloadable=downloadable,
            **kwargs,
        )
        self.format = format


class FileOutput(Output):
    def __init__(
        self,
        *,
        extension=None,
        downloadable=True,
        **kwargs,
    ):
        super().__init__(
            "file",
            downloadable=downloadable,
            **kwargs,
        )
        self.extension = extension


class AudioOutput(Output):
    def __init__(
        self,
        *,
        downloadable=True,
        **kwargs,
    ):
        super().__init__(
            "audio",
            downloadable=downloadable,
            **kwargs,
        )


class VideoOutput(Output):
    def __init__(
        self,
        *,
        downloadable=True,
        **kwargs,
    ):
        super().__init__(
            "video",
            downloadable=downloadable,
            **kwargs,
        )


class HTMLOutput(Output):
    def __init__(self, **kwargs):
        super().__init__("html", **kwargs)


class TableOutput(Output):
    def __init__(
        self,
        *,
        sortable=True,
        searchable=True,
        pagination=True,
        **kwargs,
    ):
        super().__init__("table", **kwargs)
        self.sortable = sortable
        self.searchable = searchable
        self.pagination = pagination


class PDFOutput(Output):
    def __init__(
        self,
        *,
        downloadable=True,
        **kwargs,
    ):
        super().__init__(
            "pdf",
            downloadable=downloadable,
            **kwargs,
        )


class CSVOutput(Output):
    def __init__(
        self,
        *,
        downloadable=True,
        **kwargs,
    ):
        super().__init__(
            "csv",
            downloadable=downloadable,
            **kwargs,
        )


class ZIPOutput(Output):
    def __init__(
        self,
        *,
        downloadable=True,
        **kwargs,
    ):
        super().__init__(
            "zip",
            downloadable=downloadable,
            **kwargs,
        )