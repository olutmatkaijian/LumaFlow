def calculate_voltage_divider(v_in, r1, r2):
    """
    Calculate the output voltage of a voltage divider circuit.
    """
    v_out = (r2 / (r1 + r2)) * v_in
    return v_out

def calculate_rc_time_constant(resistance, capacitance):
    """
    Calculate the time constant of an RC circuit.
    """
    time_constant = resistance * capacitance
    return time_constant
