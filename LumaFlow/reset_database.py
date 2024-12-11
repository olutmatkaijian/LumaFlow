from app import create_app, db
from app.db_models.user import User
from app.db_models.flowsheet import Flowsheet
import os
from sqlalchemy import text

def reset_database():
    app = create_app()
    with app.app_context():
        # Drop existing tables
        db.drop_all()
        
        # Drop alembic_version table
        with db.engine.connect() as connection:
            connection.execute(text('DROP TABLE IF EXISTS alembic_version'))
        
        # Create all tables
        db.create_all()
        
        # Add some initial data (optional)
        admin_user = User(username='admin', email='admin@example.com')
        admin_user.set_password('adminpassword')
        db.session.add(admin_user)

        default_flowsheet = Flowsheet(name="Default Flowsheet", content={}, user_id=1)
        db.session.add(default_flowsheet)

        db.session.commit()
        
        print("Database reset successfully.")

    # Remove existing migration files
    migration_dir = 'migrations'
    if os.path.exists(migration_dir):
        for filename in os.listdir(migration_dir):
            if filename.endswith('.py') and filename != '__init__.py':
                os.remove(os.path.join(migration_dir, filename))
        print("Existing migration files removed.")
    
    # Initialize new migration repository
    os.system('flask db init')
    
    # Create new initial migration
    os.system('flask db migrate -m "Initial migration"')
    
    # Apply the new migration
    os.system('flask db upgrade')
    
    print("New migration created and applied.")

if __name__ == "__main__":
    reset_database()

