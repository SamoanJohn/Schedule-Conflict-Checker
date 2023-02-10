import sqlite3

conn = sqlite3.connect('class_information.db')

c = conn.cursor()


#c.execute("""CREATE TABLE class_data (
#             CRN integer,
#             subject text,
#             course text,
#             section text,
#             class_name text,
#             days text,
#             start_time text,
#             end_time text,
#             building text,
#             room, text
#             instructor text
#             )""")

#c.execute("""CREATE TABLE class_prereq (
#             CRN integer,
#             prereq_CRN, integer
#             )""")

#c.execute("INSERT INTO class_data VALUES (37107,'CSCE','A101','2','Intro to Computer Science','TR','1000am','1115am','ECB','203','Witmer F')")
#c.execute("INSERT INTO class_data VALUES (30920,'CSCE','A101','201','Intro to Computer Science','MW','0100pm','0215pm','DIST','ONLINE','Johnson S')")
#c.execute("INSERT INTO class_data VALUES (30921,'CSCE','A201','1','Computer Programming I','MW','1000am','1115am','RH','117','Siddique K')")
#c.execute("INSERT INTO class_data VALUES (30922,'CSCE','A201L','1','Computer Programming I Lab','F','1235pm','0215pm','ECB','209','Siddique K')")
#c.execute("INSERT INTO class_data VALUES (30923,'CSCE','A201L','2','Computer Programming I Lab','F','0230pm','0410pm','ECB','209','Siddique K')")
#c.execute("INSERT INTO class_data VALUES (30925,'CSCE','A211','2','Computer Programming II','MW','1000am','1115am','ECB','203','Neumayer S')")
#c.execute("INSERT INTO class_data VALUES (37115,'CSCE','A211','202','Computer Programming II','MW','1000am','1115am','DIST','ONLINE','Neumayer S')")
#c.execute("INSERT INTO class_data VALUES (30926,'CSCE','A211L','201','Computer Programming II Lab','FF','1235pm','0215pm','ECBDIST','201ONLINE','Neumayer S')")
#c.execute("INSERT INTO class_data VALUES (30927,'CSCE','A211L','202','Computer Programming II Lab','FF','0230pm','0410pm','DISTECB','ONLINE201','')")
#c.execute("INSERT INTO class_data VALUES (30928,'CSCE','A241','52','Computer Hardware Concepts','TR','1000am','1115am','EIB','211','Cokgor I')")
#c.execute("INSERT INTO class_data VALUES (37117,'CSCE','A241L','51','Computer Hardware Concepts Lab','T','1145am','0215pm','EIB','314','Cokgor I')")
#c.execute("INSERT INTO class_data VALUES (37119,'CSCE','A241L','54','Computer Hardware Concepts Lab','R','1145am','0215pm','EIB','314','Cokgor I')")
#c.execute("INSERT INTO class_data VALUES (30931,'CSCE','A248','1','Comp Org & Assembly Lang Prog','MW','0100pm','0215pm','ECB','203','Cokgor I')")
#c.execute("INSERT INTO class_data VALUES (30932,'CSCE','A311','201','Data Structures & Algorithms','TR','0230pm','0345pm','DIST','ONLINE','Kominiak N')")
#c.execute("INSERT INTO class_data VALUES (30933,'CSCE','A321','1','Operating Systems','TR','1000am','1115am','EIB','401','Siddique K')")
#c.execute("INSERT INTO class_data VALUES (30934,'CSCE','A331','1','Programming Language Concepts','MW','0230pm','0345pm','ECB','201','Siddique K')")
#c.execute("INSERT INTO class_data VALUES (30935,'CSCE','A360','201','Database Systems','MW','0400pm','0515pm','ECBDIST','203ONLINE','Franklin J')")
#c.execute("INSERT INTO class_data VALUES (37116,'CSCE','A375','201','Fndmntls Cryptocurrency Tech','MW','1130am','1245pm','EIBDIST','211ONLINE','Neumayer S')")
#c.execute("INSERT INTO class_data VALUES (30936,'CSCE','A395','1','Internship in Computing','TBA','TBA','TBA','ARR','ARR','Witmer F')")
#c.execute("INSERT INTO class_data VALUES (30938,'CSCE','A415','1','Machine Learning','MW','1000am','1115am','EIB','401','Heidari Kapourchali M')")
#c.execute("INSERT INTO class_data VALUES (30939,'CSCE','A448','201','Computer Architecture','TR','0230pm','0345pm','ECBDIST','209ONLINE','Neumayer S')")
#c.execute("INSERT INTO class_data VALUES (30940,'CSCE','A465','201','Computer & Network Security','TR','0100pm','0215pm','DIST','ONLINE','Butler S')")
#c.execute("INSERT INTO class_data VALUES (30941,'CSCE','A470','1','*CSCE Capstone Project','TR','0400pm','0515pm','ECB','209','Witmer F')")
#c.execute("INSERT INTO class_data VALUES (37315,'CSCE','A490','201','Music, Comp, Tech, & Behavior','MW','0400pm','0515pm','DIST','ONLINE','Kaneshiro B')")
#c.execute("INSERT INTO class_data VALUES (38053,'CSCE','A495','1','Computing Internship Project','TBA','TBA','TBA','ARR','ARR','Witmer F')")
#c.execute("INSERT INTO class_data VALUES (37547,'CSCE','A615','1','Advanced Machine Learning','MW','1000am','1115am','EIB','401','Heidari Kapourchali M')")
#c.execute("INSERT INTO class_data VALUES (37316,'CSCE','A690','201','Music, Comp, Tech, & Behavior','MW','0400pm','0515pm','DIST','ONLINE','Kaneshiro B')")

c.execute("SELECT course FROM class_data WHERE subject='CSCE'")
print(c.fetchall())
conn.commit()

conn.close()