class MultiStream(object):
    def __init__(self, *streams):
        self.streams = streams

    def write(self, data):
        for stream in self.streams:
            stream.write(data)
            stream.flush()  # Ensure data is written out immediately

    def flush(self):
        for stream in self.streams:
            stream.flush()
