class Assembler(object):
    # Memory reference
    mri = {
        'AND': 0x0000,
        'ADD': 0x1000,
        'LDA': 0x2000,
        'STA': 0x3000,
        'BUN': 0x4000,
        'BSA': 0x5000,
        'ISZ': 0x6000
    }

    # Register reference
    rri = {
        'CLA': 0x7800,
        'CLE': 0x7400,
        'CMA': 0x7200,
        'CME': 0x7100,
        'CIR': 0x7080,
        'CIL': 0x7040,
        'INC': 0x7020,
        'SPA': 0x7010,
        'SNA': 0x7008,
        'SZA': 0x7004,
        'SZE': 0x7002,
        'HLT': 0x7001
    }

    # Input / output
    io = {
        'INP': 0xF800,
        'OUT': 0xF400,
        'SKI': 0xF200,
        'SKO': 0xF100,
        'ION': 0xF080,
        'IOF': 0xF040
    }

    def __init__(self, program):
        self.program = program
        self.address_table = self.create_address_table()

    def create_address_table(self):
        table = {}
        location = 0
        for (label, command, operand, indirect) in self.lines():
            if command == 'ORG':
                location = hex_to_int(operand)
                continue

            if label:
                table[label] = location

            location += 1

        return table

    def load(self, memory):
        location = 0
        program_start = None
        for (label, command, operand, indirect) in self.lines():
            if command == 'ORG':
                location = hex_to_int(operand)
                if program_start is None:
                    program_start = location
                continue

            elif command == 'HEX':
                instruction = hex_to_int(operand)

            elif command == 'DEC':
                instruction = int(operand)

            elif command in self.mri:
                instruction = self.mri[command] | self.address_table[operand]
                if indirect:
                    instruction |= (1 << 15)

            elif command in self.rri:
                instruction = self.rri[command]

            elif command in self.io:
                instruction = self.io[command]

            else:
                raise SyntaxError("Unrecognized command: '%s'" % command)

            memory.write(location, instruction)
            location += 1

        return program_start

    def lines(self):
        for line in self.program.split('\n'):
            line = line.strip()

            if line == '':
                # Skip empty lines
                continue

            if line == 'END':
                # End of program
                break

            yield self.parse_line(line)

    @staticmethod
    def parse_line(line):
        parts = line.split(',')
        label = None
        if len(parts) == 2:
            label = parts.pop(0)
            line = parts.pop(0).strip()

        parts = line.split()
        command = parts.pop(0)
        operand = None
        indirect = False
        if parts:
            operand = parts.pop(0)
            indirect = (parts and parts[0] == 'I')

        return label, command, operand, indirect


def hex_to_int(address):
    return int(address, 16)