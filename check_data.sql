SELECT
  (SELECT count(*) FROM nita.doctors) AS doctors,
  (SELECT count(*) FROM nita.checkup_packages) AS packages,
  (SELECT count(*) FROM nita.lab_tests) AS lab_tests,
  (SELECT count(*) FROM nita.vaccines) AS vaccines,
  (SELECT count(*) FROM nita.health_card_categories) AS health_cards,
  (SELECT count(*) FROM nita.departments) AS departments;
