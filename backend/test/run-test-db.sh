#!/bin/bash
docker run --rm --env-file ./test/.env-test-db -p 5433:5432 postgres