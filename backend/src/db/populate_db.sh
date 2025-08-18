psql postgres -d kids_quiz << 'EOF'
DELETE FROM categories;
DELETE FROM subcategories;

WITH space_category AS (
  INSERT INTO categories (label)
  VALUES ('Vesmír')
  RETURNING id
),
space_subcategory_1 AS (
  INSERT INTO subcategories (label, category_id, image_url)
  SELECT 'Vesmír 1', id, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/subcategory_images%2Fvesm%C3%ADr_1.png?alt=media&token=a24bce97-0739-4ba0-955d-ad6246c8ff4f'
  FROM space_category
  RETURNING id
)
INSERT INTO questions (text, correct_answer, answers, subcategory_id, img_url)
SELECT 'Jaká je největší planeta sluneční soustavy?', 'Jupiter', '{Jupiter,Saturn,Neptun,Pluto,"Plynný Obr"}'::text[], id, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/question_images%2Fsubcategory_ccf1e131-b2b3-4ebb-97b1-41235b81f332%2Fjupiter.png?alt=media&token=75670e1a-b182-4b1a-9960-d99e59066ae3'
FROM space_subcategory_1
UNION ALL
SELECT 'Jaká planeta je nejblíže slunci?', 'Merkur', '{Jupiter,Saturn,Země,Venuše,Merkur}'::text[], id, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/question_images%2Fsubcategory_ccf1e131-b2b3-4ebb-97b1-41235b81f332%2Fmerkur.png?alt=media&token=7fb66712-1e79-41da-bff2-7eb02ca6dbf6'
FROM space_subcategory_1
UNION ALL
SELECT 'Jak se jmenovalo první zvíře vyslané do vesmíru?', 'Lajka', '{Lajka,Bajka,Hafka,Rex,P203}'::text[], id, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/question_images%2Fsubcategory_ccf1e131-b2b3-4ebb-97b1-41235b81f332%2Flajka.png?alt=media&token=0e46f29f-4e4f-408f-91ed-98ba07fadf67'
FROM space_subcategory_1
UNION ALL
SELECT 'Jak se jmenuje galaxie ve které se nacházíme?', 'Mléčná dráha', '{"Mléčná dráha",Proxima,Orion,"Sluneční soustava","Oběžná dráha"}'::text[], id, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/question_images%2Fsubcategory_ccf1e131-b2b3-4ebb-97b1-41235b81f332%2Fml%C3%A9%C4%8Dn%C3%A1_dr%C3%A1ha.png?alt=media&token=42bbfbec-3ce8-4106-a4b2-d3ca9aadb30b'
FROM space_subcategory_1
UNION ALL
SELECT 'Co je středem sluneční soustavy?', 'Slunce', '{Slunce,Země,Měsíc,Jupiter,"Černá díra"}'::text[], id, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/question_images%2Fsubcategory_ccf1e131-b2b3-4ebb-97b1-41235b81f332%2Fslunce.png?alt=media&token=96f6b5aa-f39f-47fe-92fd-5387cff4f013'
FROM space_subcategory_1;

WITH space_subcategory_2 AS (
  INSERT INTO subcategories (label, category_id, unlock_price, image_url)
  SELECT 'Vesmír 2', id, 15,'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/subcategory_images%2Fvesm%C3%ADr_2.png?alt=media&token=f7311608-3930-4a76-a2bf-1708cb69792b'
  FROM categories
  RETURNING id
)
INSERT INTO questions (text, correct_answer, answers, subcategory_id, img_url)
SELECT 'Kdo jako první chodil po měsíci?', 'Neil Armstrong', '{"Neil Armstrong","Jurij Gagarin","Vladimír Remek","Alexej Leonov","Valentina Těreškovová"}'::text[], id, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/question_images%2Fsubcategory_ccf1e131-b2b3-4ebb-97b1-41235b81f332%2Fman_on_the_moon.png?alt=media&token=a1f6c81b-4a75-4e45-8089-73af82b7d5d0'
FROM space_subcategory_2;

WITH signs_category AS (
  INSERT INTO categories (label)
  VALUES ('Dopravní značky')
  RETURNING id
),
signs_subcategory AS (
  INSERT INTO subcategories (label, category_id, unlock_price, image_url)
  SELECT 'Zákazové značky 1', id, 25, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/subcategory_images%2Fz%C3%A1kazov%C3%A9_zna%C4%8Dky_1.png?alt=media&token=6215b192-0e9e-4c4b-acee-1a548c1dbf13'
  FROM signs_category
  RETURNING id
)

INSERT INTO questions (text, correct_answer, answers, subcategory_id, img_url)
SELECT 'Co znamená tato značka?', 'Zákaz zastavení', '{"Zákaz zastavení","Zákaz stání","Zákaz vjezdu","Zákaz parkování","Zákaz vykládky a nakládky"}'::text[], id, 'https://firebasestorage.googleapis.com/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/subcategory_images%2Fz%C3%A1kazov%C3%A9_zna%C4%8Dky_1.png?alt=media&token=6215b192-0e9e-4c4b-acee-1a548c1dbf13'
FROM signs_subcategory;

SELECT id,label FROM categories;
SELECT id,label,category_id,unlock_price FROM subcategories;
SELECT text,correct_answer,subcategory_id FROM questions;
EOF