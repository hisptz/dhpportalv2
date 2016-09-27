#!/bin/bash
curl --data-binary @datavalueset.csv "https://hmisportal.moh.go.tz/dhis/api/dataValueSets" -H "Content-Type:application/csv" -u Demo:HMISDEMO2016 -v
