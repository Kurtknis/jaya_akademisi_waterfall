import os
from flask import Flask, jsonify
from flask_cors import CORS
from .models import db

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db_path = os.path.join(app.instance_path, "jaya_akademisi.db")

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "jaya-akademisi-prod-secret-2024"),
        SQLALCHEMY_DATABASE_URI=f"sqlite:///{db_path}",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if test_config:
        app.config.update(test_config)

    # Enable CORS for localhost frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize database
    db.init_app(app)

    # Import routes
    from .routes.auth_routes import auth_bp
    from .routes.course_routes import course_bp
    from .routes.curriculum_routes import curriculum_bp
    from .routes.enrollment_routes import enrollment_bp
    from .routes.progress_routes import progress_bp
    from .routes.assignment_routes import assignment_bp
    from .routes.dashboard_routes import dashboard_bp
    from .routes.admin_routes import admin_bp

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(course_bp, url_prefix="/api/courses")
    app.register_blueprint(curriculum_bp, url_prefix="/api")
    app.register_blueprint(enrollment_bp, url_prefix="/api")
    app.register_blueprint(progress_bp, url_prefix="/api")
    app.register_blueprint(assignment_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Jaya Akademisi LMS Backend",
            "database": "SQLite",
            "version": "1.0.0"
        }), 200

    # Auto-initialize database tables
    with app.app_context():
        db.create_all()

    return app
