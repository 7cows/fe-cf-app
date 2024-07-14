from flask import Flask, render_template, send_from_directory
from flask_babel import Babel, _ as tr

app = Flask(__name__)

@app.context_processor
def inject_translator():
    # This makes `tr` available in the templates
    return dict(tr=tr)

def get_locale():
    # always use English in frontend dev
    return 'en'

def get_timezone():
    user = getattr(g, 'user', None)
    if user is not None:
        return user.timezone

babel = Babel(app, locale_selector=get_locale, timezone_selector=get_timezone)

# Serve HTML templates
@app.route("/cf")
@app.route("/cf/")
@app.route("/CF")
@app.route("/CF/")
def entry_app():
    #api_endpoint = "https://7cows.io" if app.config['ENV'] == 'production' else ""
    api_endpoint = "https://7cows.io" if True else ""
    return render_template('results.html', debug=app.debug, version='1.0.0', api_endpoint=api_endpoint, translations = get_translations())

@app.route("/cc")
@app.route("/cc/")
@app.route("/CC")
@app.route("/CC/")
def cc():
    return render_template('credit-cards.html', debug=app.debug, form_settings='11111101000', version='1.0.0', translations = get_translations())

# Serve static files like JavaScript, CSS, images
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

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
        }
    return translations

if __name__ == '__main__':
    app.run(debug=True, port=5000)
