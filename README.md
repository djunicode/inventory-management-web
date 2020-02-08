<h1 align="center">Inventory Management Web</h1>

<h4 align='center'> Repository for the Unicode 2019 - 2020 project Inventory Management.</h4>

## File Structure

```
.
├── README.md
├── src/ -> Django workspace
├── client -> React app for web dashboard
└── requirements.txt
```

## Technology Stack

#### Backend

- Django 2.2 (Python 3.6+)

#### Frontend

- React 16.6+

## Build Instructions

#### Backend

```bash
  pip3 install -r requirements.txt
  cd src
  python3 manage.py makemigrations
  python3 manage.py migrate
  python3 manage.py runserver
```

#### Frontend

```bash
  cd client
  npm install
  npm start
```

## Development Instructions

1. We have configured the precommit hook for frontend following the `eslint airbnb` guidelines along with `prettier` code formatting. So make sure to follow the above guideline otherwise code will not be commited.
2. We are using flake8 for backend.
3. The database we are using is sqlite3 for the prototype.
4. Please follow the directory structure for React JS.
