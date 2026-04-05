import random

# Common names for generation
first_names = ["James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Sandra", "Margaret", "Ashley", "Kimberly", "Emily", "Donna", "Michelle"]
last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]

def generate_students(count):
    sql = "-- 1. Massive Expansion: Students (1,000 Records)\nINSERT IGNORE INTO Students (FirstName, LastName, Email, DOB, DeptID) VALUES\n"
    for i in range(count):
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        email = f"{fn.lower()}_{ln.lower()}{i+201}@vitapstudent.edu"
        year = random.randint(2000, 2006)
        dob = f"{year}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
        dept = random.randint(1, 4)
        comma = "," if i < count - 1 else ";"
        sql += f"('{fn}', '{ln}', '{email}', '{dob}', {dept}){comma}\n"
    return sql

def generate_faculty(count):
    ranks = ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer']
    sql = "\n-- 2. Massive Expansion: Faculty (100 Records)\nINSERT IGNORE INTO Faculty (FirstName, LastName, Email, HireDate, DeptID, FacultyRank) VALUES\n"
    for i in range(count):
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        email = f"{fn.lower()}_{ln.lower()}{i+61}@vitap.edu"
        year = random.randint(2005, 2023)
        hire = f"{year}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
        dept = random.randint(1, 4)
        rank = random.choice(ranks)
        comma = "," if i < count - 1 else ";"
        sql += f"('{fn}', '{ln}', '{email}', '{hire}', {dept}, '{rank}'){comma}\n"
    return sql

# Write to file
with open('data_massive_v2.sql', 'w') as f:
    f.write("-- Smart University DBMS - Mega-Scale Data Expansion (V2)\nUSE SmartUniversityDB;\n\n")
    f.write(generate_students(1000))
    f.write(generate_faculty(100))
    f.write("\n\n-- Total: 1,000 Students, 100 Faculty, Enterprise Scale.")

print("Mega-scale data expansion V2 generated successfully!")
