CREATE TABLE main_entry_gate (
  timestamp TEXT,
  cctv_camera_location TEXT,
  corridor_width_m REAL,
  entry_flow_rate_pax_per_min REAL,
  exit_flow_rate_pax_per_min REAL,
  transport_arrival_burst INTEGER,
  queue_density_pax_per_m2 REAL,
  vehicle_count INTEGER,
  weather TEXT,
  festival_peak INTEGER,
  flow_imbalance REAL,
  avg_entry_last_5min REAL,
  avg_exit_last_5min REAL,
  pressure_growth_rate REAL,
  walking_speed_estimate REAL,
  corridor_capacity REAL,
  risk_phase TEXT
);

CREATE TABLE corridor_a_north AS SELECT * FROM main_entry_gate WHERE 0;
CREATE TABLE corridor_b_queue_lane AS SELECT * FROM main_entry_gate WHERE 0;
CREATE TABLE corridor_c_prasad_side AS SELECT * FROM main_entry_gate WHERE 0;
CREATE TABLE corridor_d_exit_return AS SELECT * FROM main_entry_gate WHERE 0;
CREATE TABLE temple_entry_dats AS SELECT * FROM main_entry_gate WHERE 0;
