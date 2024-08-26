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
            'paydown': tr("Pay down to zero")
            }
    lst = ['Parameter',
            'Value',
            'Find', 
            'Calculate',
            'Example',
            'Amortizing loan',
            'Savings plan',
            "The total amount of money borrowed or the remaining loan balance you need to repay",
            "The percentage charged on the principal by the lender, representing the cost of borrowing",
            "The period until the final payment is due",
            "The amount of money paid back to the lender at regular intervals",
            "How often payments are made, e.g., monthly or quarterly, affecting the total interest paid and the speed of loan repayment.",
            "calculate the visible loan, fill derived parameter and update KPIs",
            "a random example of a loan",
            "Maximum number of products",
            "reached",
            "Download as CSV",
            "Aggregated",
            "Disaggregated",
            "Sum of Cash Flows",
            "Cash Flow",
            "Year", "Month", "Quarter", "Payments", "Interest to Pay", "Amortization", "Outstanding Balance",
            "Monthly", "Quarterly", "Semi-annually", "Annually",
            ]
    translations |= {el: tr(el) for el in lst}
    return translations
