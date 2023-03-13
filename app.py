from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
@app.route('/index.html')
def homepage():
    return render_template("index.html")

@app.route('/gameScreen.html')
def gameScreen():
    return render_template("gameScreen.html")

if __name__ == "__main__":
    app.run(use_reloader=True, debug=True)