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

- Django 2.2+ (Python 3.6+)

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

## LICENSE

> MIT License
>
> Copyright (c) 2020 Unicode
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
