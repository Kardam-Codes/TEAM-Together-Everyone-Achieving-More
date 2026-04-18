# Dataset Guide

This project includes synthetic crowd-monitoring telemetry for temple/corridor safety analysis. The data can be used to build dashboards, trigger crowd-risk alerts, train simple prediction models, or feed the mobile response UI.

## Files

All dataset files are in the `dataset/` folder.

| File | Location | Rows | Purpose |
| --- | --- | ---: | --- |
| `main_entry_gate.csv` | Main Entry Gate | 7200 | Main ingress/exit monitoring point |
| `corridor_a_north.csv` | Corridor A North | 7200 | North corridor crowd-flow monitoring |
| `corridor_b_queue_lane.csv` | Corridor B Queue Lane | 7200 | Queue-lane density and pressure monitoring |
| `corridor_c_prasad_side.csv` | Corridor C Prasad Side | 7200 | Prasad-side corridor monitoring |
| `corridor_d_exit_return.csv` | Corridor D Exit Return | 7200 | Exit/return corridor monitoring |
| `temple_entry_dats.csv` | Temple Entry Dats | 7200 | Temple entry telemetry |
| `somnath_temple_all_cctv_locations.csv` | Combined locations | 43200 | Combined dataset for all CCTV locations |
| `table_manifest.json` | Metadata | - | Lists table names, camera locations, files, and row counts |
| `table_schema.sql` | SQL schema | - | SQLite-compatible schema for loading the CSV tables |
| `crowd_data.csv` | Placeholder | 0 | Empty placeholder file currently |

Each location-level CSV has the same schema, so the files can be loaded individually or combined into one table.

## Columns

| Column | Type | Meaning |
| --- | --- | --- |
| `timestamp` | datetime/text | Minute-level timestamp for the telemetry record |
| `cctv_camera_location` | text | CCTV/corridor location name |
| `corridor_width_m` | number | Corridor width in meters |
| `entry_flow_rate_pax_per_min` | number | People entering per minute |
| `exit_flow_rate_pax_per_min` | number | People exiting per minute |
| `transport_arrival_burst` | integer | `1` when a transport arrival burst is active, otherwise `0` |
| `queue_density_pax_per_m2` | number | Estimated people per square meter |
| `vehicle_count` | integer | Nearby/related vehicle count |
| `weather` | text | Weather condition |
| `festival_peak` | integer | `1` during festival peak period, otherwise `0` |
| `flow_imbalance` | number | Exit flow subtracted from entry flow |
| `avg_entry_last_5min` | number | Rolling 5-minute average entry flow |
| `avg_exit_last_5min` | number | Rolling 5-minute average exit flow |
| `pressure_growth_rate` | number | Estimated rate of crowd-pressure growth |
| `walking_speed_estimate` | number | Estimated walking speed in meters/second |
| `corridor_capacity` | number | Estimated corridor capacity |
| `risk_phase` | text | Risk state, such as `recovery`, used for alert classification |

## Loading With Python

Use `pandas` for quick analysis:

```python
import pandas as pd

df = pd.read_csv("dataset/main_entry_gate.csv", parse_dates=["timestamp"])

print(df.head())
print(df["risk_phase"].value_counts())
print(df[["queue_density_pax_per_m2", "pressure_growth_rate"]].describe())
```

To load all location CSVs into one dataframe:

```python
import pandas as pd
from pathlib import Path

files = [
    "main_entry_gate.csv",
    "corridor_a_north.csv",
    "corridor_b_queue_lane.csv",
    "corridor_c_prasad_side.csv",
    "corridor_d_exit_return.csv",
    "temple_entry_dats.csv",
]

frames = [
    pd.read_csv(Path("dataset") / file, parse_dates=["timestamp"])
    for file in files
]

all_locations = pd.concat(frames, ignore_index=True)
```

You can also use the already combined file:

```python
import pandas as pd

all_locations = pd.read_csv(
    "dataset/somnath_temple_all_cctv_locations.csv",
    parse_dates=["timestamp"],
)
```

## Loading Into SQLite

Create the tables with:

```bash
sqlite3 crowd_monitoring.db < dataset/table_schema.sql
```

Then import a CSV:

```sql
.mode csv
.headers on
.import dataset/main_entry_gate.csv main_entry_gate
```

Repeat the `.import` command for each location table.

## Useful Metrics

The mobile UI can be powered from these fields:

| UI Metric | Dataset Field |
| --- | --- |
| Current density | `queue_density_pax_per_m2` |
| Flow rate | `entry_flow_rate_pax_per_min` or `exit_flow_rate_pax_per_min` |
| Pressure index | Derived from `queue_density_pax_per_m2`, `flow_imbalance`, and `pressure_growth_rate` |
| Transport burst | `transport_arrival_burst` and `vehicle_count` |
| Festival peak mode | `festival_peak` |
| Risk phase/status | `risk_phase` |
| Live trend graph | `pressure_growth_rate` over time |

Example pressure-index calculation:

```python
density_score = (df["queue_density_pax_per_m2"] / 8).clip(0, 1) * 60
imbalance_score = (df["flow_imbalance"].abs() / 120).clip(0, 1) * 25
growth_score = (df["pressure_growth_rate"].clip(lower=0) / 0.2).clip(0, 1) * 15

df["pressure_index"] = density_score + imbalance_score + growth_score
```

## Example Alert Logic

A simple rule-based alert can start with:

```python
def classify_alert(row):
    if row["queue_density_pax_per_m2"] >= 4.5 and row["pressure_growth_rate"] > 0:
        return "danger"
    if row["queue_density_pax_per_m2"] >= 3.5:
        return "warning"
    return "normal"

df["alert_level"] = df.apply(classify_alert, axis=1)
```

For the response UI:

- Show `danger` when density is above the critical threshold and pressure is rising.
- Show `warning` when density is high but pressure is stable.
- Show `recovery` when exit flow is greater than entry flow and density is dropping.

## Recommended Workflow

1. Pick one CSV for single-location testing, usually `main_entry_gate.csv`.
2. Parse `timestamp` as a datetime column.
3. Sort by `timestamp`.
4. Use `queue_density_pax_per_m2`, `flow_imbalance`, and `pressure_growth_rate` for risk detection.
5. Use `cctv_camera_location` to group or filter the data.
6. Use `somnath_temple_all_cctv_locations.csv` when building multi-location dashboards.

## Notes

- The data is minute-level telemetry.
- Location CSVs share the same column names.
- `crowd_data.csv` is currently empty and should not be used for analysis unless it is populated later.
- Values such as pressure index and alert countdown are app-level derived metrics, not direct CSV columns.
