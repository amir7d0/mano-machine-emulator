class Logger(object):
    def __init__(self):
        self.messages = []

    def log(self, message):
        self.messages.append(message)

    def __str__(self):
        if self.messages:
            return 'Logger(last_message="%s")' % self.messages

        return 'Logger()'