DROP TABLE IF EXISTS locations;
CREATE TABLE locations (
  search_query VARCHAR(300),
  formatted_query VARCHAR(300),
  latitude NUMERIC(25, 16),
  longitude NUMERIC(25, 16)
);