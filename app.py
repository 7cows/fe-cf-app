from flask import Flask, render_template, send_from_directory
from flask_babel import Babel, _ as tr

app = Flask(__name__)
babel = Babel(app)

@app.context_processor
def inject_translator():
    # This makes `tr` available in the templates
    return dict(tr=tr)

@babel.localeselector
def get_locale():
    # always use English in frontend dev
    return 'en'


# Serve HTML templates
@app.route("/cf")
@app.route("/cf/")
@app.route("/CF")
@app.route("/CF/")
def entry_app():
    #api_endpoint = "https://7cows.io" if app.config['ENV'] == 'production' else ""
    api_endpoint = "https://7cows.io" if True else ""
    return render_template('results.html', debug=app.debug, version='1.0.0', api_endpoint=api_endpoint)

@app.route("/cc")
@app.route("/cc/")
@app.route("/CC")
@app.route("/CC/")
def cc():
    return render_template('credit-cards.html', debug=app.debug, form_settings='11111101000', version='1.0.0')

# Serve static files like JavaScript, CSS, images
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
