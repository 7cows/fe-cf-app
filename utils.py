from flask_babel import _ as tr

def get_translations():
    translations = {
            'short_desc': tr("Description"),
            'P0': tr("Principal"),
            'r': tr("Interest Rate"),
            'T': tr("Loan Maturity"),
            'A': tr("Regular payment"),
            'n': tr("Frequency"),
            'shift': tr("Delay payback"),
            'minimumPayment': tr("Minimal payment"),
            'compounding': tr("Compounding"),
            'remaining_debt': tr("Remaining debt"),
            'paydown': tr("Pay down to zero"),
            'Parameter': tr("Parameter"),
            'Value': tr("Value"),
            'Derive': tr("Find"),
            'Calculate': tr("Calculate"),
            'Example': tr("Example"),
        }
    return translations