#!/bin/bash

# Script to fetch and checkout main branch for fe, curriculum, and interpreters

update_repo() {
    local repo_name=$1
    local repo_path=$2
    local emoji=$3

    echo "$emoji Updating $repo_name repository..."
    cd "$repo_path"

    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo "  📝 Stashing local changes..."
        git stash push -m "Auto-stash before checkout-main script"
        local stashed=true
    else
        local stashed=false
    fi

    # Fetch and checkout main
    git fetch origin
    git checkout main
    git pull origin main

    # Restore stashed changes if any
    if [ "$stashed" = true ]; then
        echo "  📝 Restoring stashed changes..."
        git stash pop
    fi

    echo "✅ $repo_name updated"
    echo ""
}

# Update all three repositories
update_repo "fe" "." "📦"
update_repo "curriculum" "../curriculum" "📚"
update_repo "interpreters" "../interpreters" "🔧"

echo "🎉 All repositories updated to main branch!"