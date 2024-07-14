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
            'Find': tr("Find"),
            'Calculate': tr("Calculate"),
            'Example': tr("Example"),
            'Amortizing loan': tr("Amortizing loan"),
            'Savings plan': tr("Savings plan"),
            "The total amount of money borrowed or the remaining loan balance you need to repay": tr("The total amount of money borrowed or the remaining loan balance you need to repay"),
            "The percentage charged on the principal by the lender, representing the cost of borrowing": tr("The percentage charged on the principal by the lender, representing the cost of borrowing"),
            "The period until the final payment is due": tr("The period until the final payment is due"),
            "The amount of money paid back to the lender at regular intervals": tr("The amount of money paid back to the lender at regular intervals"),
            "How often payments are made, e.g., monthly or quarterly, affecting the total interest paid and the speed of loan repayment.": tr("How often payments are made, e.g., monthly or quarterly, affecting the total interest paid and the speed of loan repayment."),
            "calculate the visible loan, fill derived parameter and update KPIs": tr("calculate the visible loan, fill derived parameter and update KPIs"),
            "a random example of a loan": tr("a random example of a loan"),
        }
    return translations
