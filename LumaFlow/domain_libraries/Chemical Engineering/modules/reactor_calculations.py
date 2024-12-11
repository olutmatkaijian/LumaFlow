def calculate_reaction_rate(concentration, temperature, activation_energy, pre_exponential_factor):
    """
    Calculate the reaction rate using the Arrhenius equation.
    """
    import math

    R = 8.314  # Gas constant in J/(mol·K)
    k = pre_exponential_factor * math.exp(-activation_energy / (R * temperature))
    rate = k * concentration
    return rate
