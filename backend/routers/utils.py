def calculate_health(current_usage,last_maintenance):
    usage=current_usage-last_maintenance

    if usage<300:
        return "Good"
    
    elif usage<500:
        return "Warning"
    
    else:
        return "Critical"