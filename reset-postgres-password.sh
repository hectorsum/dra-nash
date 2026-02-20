#!/bin/bash

# Script to temporarily enable trust authentication for PostgreSQL
# This allows you to connect without a password to reset it

echo "Backing up pg_hba.conf..."
sudo cp /Library/PostgreSQL/15/data/pg_hba.conf /Library/PostgreSQL/15/data/pg_hba.conf.backup

echo "Enabling trust authentication..."
# This allows local connections without password
sudo sed -i '' 's/md5/trust/g' /Library/PostgreSQL/15/data/pg_hba.conf

echo "Restarting PostgreSQL..."
sudo /Library/PostgreSQL/15/bin/pg_ctl restart -D /Library/PostgreSQL/15/data

echo "Now you can connect and reset password. Run:"
echo "/Library/PostgreSQL/15/bin/psql -h localhost -U postgres -c \"ALTER USER postgres PASSWORD 'newpassword';\""
echo ""
echo "After resetting, restore security:"
echo "sudo mv /Library/PostgreSQL/15/data/pg_hba.conf.backup /Library/PostgreSQL/15/data/pg_hba.conf"
echo "sudo /Library/PostgreSQL/15/bin/pg_ctl restart -D /Library/PostgreSQL/15/data"
