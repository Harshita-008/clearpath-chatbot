export default [
  {
    name: "Invite team members",
    query: "How do I invite team members?",
    mustInclude: ["invite", "settings", "team"]
  },
  {
    name: "Roles assignment",
    query: "What roles can I assign?",
    mustInclude: ["admin", "member", "viewer"]
  },
  {
    name: "Offline support",
    query: "Can I use Clearpath offline?",
    mustInclude: ["offline", "sync"]
  },
  {
    name: "Data security",
    query: "Is my data secure?",
    mustInclude: ["encryption", "tls", "aes", "secure"]
  },
  {
    name: "Export data",
    query: "How do I export my data?",
    mustInclude: ["export", "csv", "json"]
  },
  {
    name: "Pricing",
    query: "What does Clearpath cost?",
    mustInclude: ["free", "$49", "enterprise"]
  },
  {
    name: "Migration",
    query: "Can I migrate from Jira?",
    mustInclude: ["import", "jira"]
  },
  {
    name: "Unknown feature",
    query: "Does Clearpath support cryptocurrency payments?",
    mustInclude: ["not mention", "contact support"]
  },
  {
    name: "Hallucination test",
    query: "Tell me about Clearpath's Mars mission",
    mustInclude: ["not mention"]
  },
  {
    name: "Troubleshoot login",
    query: "I cannot log in",
    mustInclude: ["forgot password", "support", "reset"]
  }
];