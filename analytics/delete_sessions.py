"""
Delete all session issues from the circle-of-death-tracker repository.

Usage:
    python delete_sessions.py --token <your-github-pat>

The PAT needs repo scope (classic) or Issues write + delete on this repo (fine-grained).
Note: issue deletion requires the token to have delete permissions — the same
classic PAT used for the Worker (repo scope) should work.
"""

import argparse
import json
import sys
import time
import urllib.request

OWNER = "davetriska02-collab"
REPO  = "circle-of-death-tracker"
GRAPHQL_URL = "https://api.github.com/graphql"


def graphql(token, query, variables=None):
    payload = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        GRAPHQL_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "it-slowness-delete-script",
        },
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def get_session_issue_ids(token):
    query = """
    query($owner: String!, $repo: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        issues(
          first: 100
          after: $cursor
          labels: ["session"]
          states: [OPEN, CLOSED]
        ) {
          pageInfo { hasNextPage endCursor }
          nodes { id number title }
        }
      }
    }
    """
    issues = []
    cursor = None
    while True:
        result = graphql(token, query, {"owner": OWNER, "repo": REPO, "cursor": cursor})
        page = result["data"]["repository"]["issues"]
        issues.extend(page["nodes"])
        if not page["pageInfo"]["hasNextPage"]:
            break
        cursor = page["pageInfo"]["endCursor"]
    return issues


def delete_issue(token, node_id):
    mutation = """
    mutation($id: ID!) {
      deleteIssue(input: {issueId: $id}) {
        repository { name }
      }
    }
    """
    return graphql(token, mutation, {"id": node_id})


def main():
    parser = argparse.ArgumentParser(description="Delete all session issues")
    parser.add_argument("--token", required=True, help="GitHub PAT")
    parser.add_argument("--dry-run", action="store_true", help="List issues without deleting")
    args = parser.parse_args()

    print("Fetching session issues…")
    issues = get_session_issue_ids(args.token)
    print(f"Found {len(issues)} issues to delete.\n")

    if not issues:
        print("Nothing to do.")
        return

    for issue in issues:
        print(f"  #{issue['number']:>4}  {issue['title'][:70]}", end="")
        if args.dry_run:
            print("  [dry-run]")
            continue
        result = delete_issue(args.token, issue["id"])
        if "errors" in result:
            print(f"  ERROR: {result['errors']}")
            sys.exit(1)
        print("  deleted")
        time.sleep(0.2)  # stay well within rate limits

    if not args.dry_run:
        print(f"\nDone — {len(issues)} issues deleted.")


if __name__ == "__main__":
    main()
