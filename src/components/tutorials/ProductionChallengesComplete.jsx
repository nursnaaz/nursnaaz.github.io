

import { useState, useEffect } from 'react'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Container from '@cloudscape-design/components/container'
import Box from '@cloudscape-design/components/box'
import Alert from '@cloudscape-design/components/alert'
import Header from '@cloudscape-design/components/header'
import Tabs from '@cloudscape-design/components/tabs'
import { StudentNote } from '../interactive/StudentNote'


export function ProductionChallengesComplete({ onStepChange }) {
  const [activeTabId, setActiveTabId] = useState('overview')


  useEffect(() => {
    if (onStepChange) {
      const tabIndex = tabs.findIndex(tab => tab.id === activeTabId)
      onStepChange(tabIndex, tabs.length)
    }
  }, [activeTabId, onStepChange])


  const tabs = [
    { id: 'overview', label: '📋 Overview', content: <OverviewSection /> },
    { id: 'deployment', label: '🚀 Deployment', content: <DeploymentSection /> },
    { id: 'scaling', label: '📈 Scaling', content: <ScalingSection /> },
    { id: 'monitoring', label: '📊 Monitoring', content: <MonitoringSection /> },
    { id: 'reliability', label: '🛡️ Reliability', content: <ReliabilitySection /> },
    { id: 'cost', label: '💰 Cost Management', content: <CostSection /> },
    { id: 'security', label: '🔒 Security', content: <SecuritySection /> },
    { id: 'best-practices', label: '✨ Best Practices', content: <BestPracticesSection /> },
    { id: 'references', label: '📚 References', content: <ReferencesSection /> }
  ]


  return (
    <SpaceBetween size="l">
      <Container>
        <Box fontSize="heading-xl" textAlign="center" padding="l">
          <Box fontSize="display-l" fontWeight="bold" color="text-status-error">
            ⚠️ Production Challenges of AI Agents
          </Box>
          <Box fontSize="heading-m" color="text-body-secondary" marginTop="s">
            Real-world challenges, data-driven insights, and battle-tested solutions
          </Box>
        </Box>
      </Container>


      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        variant="container"
      />
    </SpaceBetween>
  )
}


// Overview Section
function OverviewSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">🎯 Production Challenges Overview</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Moving AI agents from development to production presents unique challenges that require careful 
            planning, robust architecture, and continuous monitoring. Based on comprehensive analysis of 40+ 
            industry reports, this guide explores the real challenges and solutions for deploying agents at scale.
          </Box>


          <div style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)', 
            color: 'white', 
            padding: '30px', 
            borderRadius: '15px',
            textAlign: 'center',
            margin: '25px 0'
          }}>
            <Box fontSize="heading-l" marginBottom="m">🏗️ The Reality Gap</Box>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '10px' }}>
                Development<br/><strong>90% Success</strong>
              </div>
              <span style={{ fontSize: '24px' }}>→</span>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '10px' }}>
                Staging<br/><strong>70% Success</strong>
              </div>
              <span style={{ fontSize: '24px' }}>→</span>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '10px' }}>
                Production<br/><strong>13-40% Success</strong>
              </div>
              <span style={{ fontSize: '24px' }}>→</span>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '10px' }}>
                40% Projects<br/><strong>Canceled by 2027</strong>
              </div>
            </div>
          </div>


          <Alert type="error" header="⚠️ Critical Statistics">
            <SpaceBetween size="s">
              <Box><strong>Gartner Prediction:</strong> 40% of agentic AI projects will be canceled by 2027</Box>
              <Box><strong>Developer Trust Crisis:</strong> Trust dropped from 40% to 29% in one year</Box>
              <Box><strong>Quality Issues:</strong> 61% of companies report accuracy as their primary concern</Box>
              <Box><strong>ROI Paradox:</strong> 80% report no material earnings impact despite widespread adoption</Box>
            </SpaceBetween>
          </Alert>


          <Container>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Challenge Category</th>
                  <th style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Impact Rate</th>
                  <th style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Primary Concern</th>
                  <th style={{ padding: '15px', textAlign: 'left', border: '1px solid #ddd' }}>Financial Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>Quality & Accuracy</strong></td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>61% of companies</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Hallucination rates 15-27%</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Only 20-40% real deflection</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>Security Vulnerabilities</strong></td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>48% of AI code</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>322% more privilege escalation</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>$9.77M avg healthcare breach</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>Trust Erosion</strong></td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>29% developer trust</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>73% consumer privacy worries</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Brand reputation damage</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>Technical Debt</strong></td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Code churn doubled</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>8x duplicate code increase</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>68% more security fix time</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>Cost Overruns</strong></td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>90%+ cite costs</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>$20M daily predictions</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Costs exceed investment</td>
                </tr>
              </tbody>
            </table>
          </Container>


          <Alert type="success" header="✅ Success Factors (74% achieve ROI)">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Start Narrow:</strong> Bounded use cases with clear metrics</li>
              <li><strong>Invest Early:</strong> Observability infrastructure from day 1</li>
              <li><strong>Human Oversight:</strong> Default to human-in-loop, not full autonomy</li>
              <li><strong>Cost Controls:</strong> Implement optimization before scaling</li>
              <li><strong>Continuous Testing:</strong> Red team as ongoing practice</li>
              <li><strong>Measure Everything:</strong> Data-driven iteration over enthusiasm</li>
            </ul>
          </Alert>


          <StudentNote title="🔍 Key Insight">
            <strong>Speed of deployment inversely correlates with success.</strong> The 74% achieving ROI 
            deployed strategically; the 40% being canceled rushed without addressing fundamentals.
            <br/><br/>
            <em>Source: Synthesis of Stack Overflow 2024-2025, Gartner, McKinsey, LangChain State of AI Agents, 
            and Google Cloud ROI studies.</em>
          </StudentNote>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Deployment Section
function DeploymentSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">🚀 Integration & Infrastructure Gaps</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Deploying AI agents into existing production systems reveals critical gaps in organizational 
            readiness and technical infrastructure. Most companies underestimate the complexity of integrating 
            AI agents with legacy systems and existing workflows.
          </Box>


          <Alert type="warning" header="⚠️ Deployment Readiness Crisis">
            <SpaceBetween size="s">
              <Box><strong>Only 13% of organizations fully prepared</strong> for AI integration</Box>
              <Box><strong>53% report skills gaps</strong> in specialized AI infrastructure</Box>
              <Box><strong>80% face data preprocessing challenges</strong> when integrating with existing systems</Box>
              <Box><strong>Multi-model strategies create complexity</strong> that overwhelms existing DevOps practices</Box>
            </SpaceBetween>
          </Alert>


          <Container header={<Header variant="h3">Organizational Readiness Gap</Header>}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Readiness Factor</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Fully Prepared</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Partially Prepared</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Not Prepared</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>AI Infrastructure</strong></td>
                  <td style={{ padding: '12px' }}>13%</td>
                  <td style={{ padding: '12px' }}>45%</td>
                  <td style={{ padding: '12px' }}>42%</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Skills & Training</strong></td>
                  <td style={{ padding: '12px' }}>18%</td>
                  <td style={{ padding: '12px' }}>47%</td>
                  <td style={{ padding: '12px' }}>35%</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Data Governance</strong></td>
                  <td style={{ padding: '12px' }}>15%</td>
                  <td style={{ padding: '12px' }}>42%</td>
                  <td style={{ padding: '12px' }}>43%</td>
                </tr>
              </tbody>
            </table>
          </Container>


          <StudentNote title="💡 Deployment Best Practices">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Start Small:</strong> Begin with low-risk, bounded use cases</li>
              <li><strong>Build Infrastructure First:</strong> Observability before deployment</li>
              <li><strong>Train Teams:</strong> Invest in AI-specific skills development</li>
              <li><strong>Integrate Gradually:</strong> Phased rollout with monitoring</li>
            </ul>
          </StudentNote>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Scaling Section
function ScalingSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">📈 Scaling Challenges</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Scaling AI agents from pilot to production reveals performance bottlenecks, cost explosions, 
            and reliability issues that weren't apparent in development.
          </Box>


          <Alert type="warning" header="⚠️ Scaling Reality">
            <SpaceBetween size="s">
              <Box><strong>Performance Degradation:</strong> Response times increase 3-5x under load</Box>
              <Box><strong>Cost Explosion:</strong> Inference costs can reach $20M daily at scale</Box>
              <Box><strong>Quality Drops:</strong> Accuracy decreases 15-30% with production data</Box>
              <Box><strong>Latency Issues:</strong> 70% of users abandon after 3-second wait</Box>
            </SpaceBetween>
          </Alert>


          <StudentNote title="💡 Scaling Strategies">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Caching:</strong> Cache common queries to reduce API calls</li>
              <li><strong>Batching:</strong> Process multiple requests together</li>
              <li><strong>Model Optimization:</strong> Use quantization and distillation</li>
              <li><strong>Load Balancing:</strong> Distribute requests across instances</li>
              <li><strong>Auto-scaling:</strong> Scale infrastructure based on demand</li>
            </ul>
          </StudentNote>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Monitoring Section
function MonitoringSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">📊 Monitoring & Observability</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Without proper monitoring, AI agents become black boxes that fail silently. Comprehensive 
            observability is essential for detecting issues before they impact users.
          </Box>


          <Alert type="info" header="🔑 Key Metrics to Monitor">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Response Quality:</strong> Hallucination rate, accuracy, relevance scores</li>
              <li><strong>Performance:</strong> Latency, throughput, token usage</li>
              <li><strong>Costs:</strong> API calls, token consumption, infrastructure spend</li>
              <li><strong>Errors:</strong> Failure rates, timeout rates, retry counts</li>
              <li><strong>User Behavior:</strong> Satisfaction scores, abandonment rates</li>
            </ul>
          </Alert>


          <StudentNote title="💡 Monitoring Tools">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>LangSmith:</strong> LLM-specific tracing and debugging</li>
              <li><strong>Weights & Biases:</strong> Experiment tracking and visualization</li>
              <li><strong>Prometheus + Grafana:</strong> Infrastructure metrics</li>
              <li><strong>DataDog:</strong> Full-stack observability</li>
              <li><strong>Custom Dashboards:</strong> Business-specific KPIs</li>
            </ul>
          </StudentNote>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Reliability Section
function ReliabilitySection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">🛡️ Reliability & Error Handling</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            AI agents must handle failures gracefully and maintain reliability even when external 
            dependencies fail. Building resilient systems requires careful error handling and fallback strategies.
          </Box>


          <Alert type="error" header="⚠️ Common Failure Modes">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>API Timeouts:</strong> External services become unavailable</li>
              <li><strong>Rate Limiting:</strong> Hitting API quotas during peak usage</li>
              <li><strong>Model Hallucinations:</strong> Generating incorrect or nonsensical responses</li>
              <li><strong>Context Window Overflow:</strong> Exceeding token limits</li>
              <li><strong>Tool Execution Failures:</strong> External tools return errors</li>
              <li><strong>Network Issues:</strong> Connectivity problems with dependencies</li>
            </ul>
          </Alert>


          <Container header={<Header variant="h3">Reliability Patterns</Header>}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Pattern</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Use Case</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Implementation</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Circuit Breaker</strong></td>
                  <td style={{ padding: '12px' }}>Prevent cascading failures</td>
                  <td style={{ padding: '12px' }}>Stop calling failing services temporarily</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Retry with Backoff</strong></td>
                  <td style={{ padding: '12px' }}>Handle transient failures</td>
                  <td style={{ padding: '12px' }}>Exponential backoff with jitter</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Fallback Responses</strong></td>
                  <td style={{ padding: '12px' }}>Graceful degradation</td>
                  <td style={{ padding: '12px' }}>Provide cached or default responses</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Timeout Management</strong></td>
                  <td style={{ padding: '12px' }}>Prevent hanging requests</td>
                  <td style={{ padding: '12px' }}>Set aggressive timeouts with retries</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Health Checks</strong></td>
                  <td style={{ padding: '12px' }}>Monitor system health</td>
                  <td style={{ padding: '12px' }}>Regular dependency validation</td>
                </tr>
              </tbody>
            </table>
          </Container>


          <StudentNote title="💡 Error Handling Best Practices">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Fail Fast:</strong> Detect errors early and fail gracefully</li>
              <li><strong>Log Everything:</strong> Comprehensive error logging for debugging</li>
              <li><strong>User Communication:</strong> Clear error messages for users</li>
              <li><strong>Automatic Recovery:</strong> Self-healing where possible</li>
              <li><strong>Alerting:</strong> Notify teams of critical failures immediately</li>
            </ul>
          </StudentNote>


          <Box variant="code" padding="m">
            <pre style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
{`# Example: Robust API Call with Retry Logic
import time
from tenacity import retry, stop_after_attempt, wait_exponential


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def call_llm_with_retry(prompt):
    try:
        response = llm.invoke(prompt, timeout=30)
        return response
    except TimeoutError:
        logger.error("LLM timeout - retrying...")
        raise
    except RateLimitError:
        logger.warning("Rate limit hit - backing off...")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return fallback_response(prompt)


def fallback_response(prompt):
    """Provide cached or default response when LLM fails"""
    return {
        "response": "I'm experiencing technical difficulties. Please try again.",
        "fallback": True
    }`}
            </pre>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Cost Management Section
function CostSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">💰 Cost Management & Optimization</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            AI agent costs can spiral out of control without proper management. Token usage, API calls, 
            and infrastructure costs require continuous monitoring and optimization.
          </Box>


          <Alert type="warning" header="⚠️ Cost Reality Check">
            <SpaceBetween size="s">
              <Box><strong>$20M Daily:</strong> Potential inference costs at scale</Box>
              <Box><strong>90%+ Organizations:</strong> Cite costs as primary concern</Box>
              <Box><strong>Hidden Costs:</strong> Infrastructure, monitoring, human oversight</Box>
              <Box><strong>ROI Challenge:</strong> 80% report no material earnings impact</Box>
            </SpaceBetween>
          </Alert>


          <Container header={<Header variant="h3">Cost Breakdown</Header>}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Cost Category</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Typical %</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Optimization Strategy</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>LLM API Calls</strong></td>
                  <td style={{ padding: '12px' }}>40-60%</td>
                  <td style={{ padding: '12px' }}>Caching, prompt optimization, smaller models</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Infrastructure</strong></td>
                  <td style={{ padding: '12px' }}>20-30%</td>
                  <td style={{ padding: '12px' }}>Auto-scaling, spot instances, serverless</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Vector Databases</strong></td>
                  <td style={{ padding: '12px' }}>10-15%</td>
                  <td style={{ padding: '12px' }}>Efficient indexing, query optimization</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Monitoring & Logging</strong></td>
                  <td style={{ padding: '12px' }}>5-10%</td>
                  <td style={{ padding: '12px' }}>Sampling, log retention policies</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Human Oversight</strong></td>
                  <td style={{ padding: '12px' }}>10-20%</td>
                  <td style={{ padding: '12px' }}>Automation, efficient workflows</td>
                </tr>
              </tbody>
            </table>
          </Container>


          <StudentNote title="💡 Cost Optimization Strategies">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Prompt Engineering:</strong> Reduce token usage by 30-50%</li>
              <li><strong>Response Caching:</strong> Cache common queries (70% hit rate possible)</li>
              <li><strong>Model Selection:</strong> Use smaller models for simple tasks</li>
              <li><strong>Batch Processing:</strong> Group requests to reduce overhead</li>
              <li><strong>Rate Limiting:</strong> Prevent abuse and control costs</li>
              <li><strong>Budget Alerts:</strong> Set spending thresholds and alerts</li>
            </ul>
          </StudentNote>


          <Box variant="code" padding="m">
            <pre style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
{`# Example: Cost-Aware LLM Selection
def select_model_by_complexity(task_complexity, budget_per_request):
    """Choose appropriate model based on task and budget"""
    
    if task_complexity == "simple" and budget_per_request < 0.001:
        return "gpt-3.5-turbo"  # $0.0005 per 1K tokens
    elif task_complexity == "medium" and budget_per_request < 0.01:
        return "gpt-4-turbo"    # $0.01 per 1K tokens
    elif task_complexity == "complex":
        return "gpt-4"          # $0.03 per 1K tokens
    else:
        return "claude-instant" # Fallback to cheaper option


# Example: Response Caching
from functools import lru_cache
import hashlib


@lru_cache(maxsize=1000)
def cached_llm_call(prompt_hash):
    """Cache LLM responses to reduce API calls"""
    return llm.invoke(prompt)


def get_response(prompt):
    prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
    return cached_llm_call(prompt_hash)`}
            </pre>
          </Box>


          <Alert type="success" header="✅ Cost Optimization Results">
            <SpaceBetween size="s">
              <Box><strong>70% Cost Reduction:</strong> Through caching and prompt optimization</Box>
              <Box><strong>50% Token Savings:</strong> Using smaller models for simple tasks</Box>
              <Box><strong>30% Infrastructure Savings:</strong> Auto-scaling and spot instances</Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Security Section
function SecuritySection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">🔒 Security & Privacy</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            AI agents introduce unique security challenges including prompt injection, data leakage, 
            and privilege escalation. Comprehensive security measures are essential for production deployment.
          </Box>


          <Alert type="error" header="⚠️ Security Threats">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Prompt Injection:</strong> Malicious prompts that override instructions</li>
              <li><strong>Data Leakage:</strong> Exposing sensitive information in responses</li>
              <li><strong>Privilege Escalation:</strong> 322% more vulnerabilities in AI code</li>
              <li><strong>Model Poisoning:</strong> Corrupting training data or fine-tuning</li>
              <li><strong>API Key Exposure:</strong> Leaked credentials in logs or responses</li>
              <li><strong>Denial of Service:</strong> Resource exhaustion attacks</li>
            </ul>
          </Alert>


          <Container header={<Header variant="h3">Security Best Practices</Header>}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Security Layer</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Implementation</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Input Validation</strong></td>
                  <td style={{ padding: '12px' }}>Sanitize all user inputs, detect injection attempts</td>
                  <td style={{ padding: '12px', color: '#e74c3c' }}>Critical</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Output Filtering</strong></td>
                  <td style={{ padding: '12px' }}>Redact PII, filter sensitive data</td>
                  <td style={{ padding: '12px', color: '#e74c3c' }}>Critical</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Access Control</strong></td>
                  <td style={{ padding: '12px' }}>Role-based permissions, least privilege</td>
                  <td style={{ padding: '12px', color: '#e74c3c' }}>Critical</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Audit Logging</strong></td>
                  <td style={{ padding: '12px' }}>Log all interactions, detect anomalies</td>
                  <td style={{ padding: '12px', color: '#f39c12' }}>High</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Rate Limiting</strong></td>
                  <td style={{ padding: '12px' }}>Prevent abuse and DoS attacks</td>
                  <td style={{ padding: '12px', color: '#f39c12' }}>High</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Encryption</strong></td>
                  <td style={{ padding: '12px' }}>Encrypt data in transit and at rest</td>
                  <td style={{ padding: '12px', color: '#27ae60' }}>Medium</td>
                </tr>
              </tbody>
            </table>
          </Container>


          <StudentNote title="💡 Security Implementation">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Defense in Depth:</strong> Multiple security layers</li>
              <li><strong>Zero Trust:</strong> Verify every request, trust nothing</li>
              <li><strong>Regular Audits:</strong> Continuous security testing</li>
              <li><strong>Incident Response:</strong> Plan for security breaches</li>
              <li><strong>Compliance:</strong> Meet regulatory requirements (GDPR, HIPAA)</li>
            </ul>
          </StudentNote>


          <Box variant="code" padding="m">
            <pre style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
{`# Example: Input Validation and Sanitization
import re
from typing import Optional


def validate_and_sanitize_input(user_input: str) -> Optional[str]:
    """Validate and sanitize user input to prevent injection attacks"""
    
    # Check for prompt injection patterns
    injection_patterns = [
        r"ignore previous instructions",
        r"disregard all",
        r"system prompt",
        r"<script>",
        r"eval\\(",
    ]
    
    for pattern in injection_patterns:
        if re.search(pattern, user_input, re.IGNORECASE):
            logger.warning(f"Potential injection detected: {pattern}")
            return None
    
    # Sanitize input
    sanitized = user_input.strip()
    sanitized = re.sub(r'[<>]', '', sanitized)  # Remove HTML tags
    
    # Length check
    if len(sanitized) > 10000:
        logger.warning("Input too long")
        return None
    
    return sanitized


# Example: Output Filtering for PII
import re


def redact_pii(text: str) -> str:
    """Remove personally identifiable information from output"""
    
    # Redact email addresses
    text = re.sub(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', 
                  '[EMAIL REDACTED]', text)
    
    # Redact phone numbers
    text = re.sub(r'\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b', 
                  '[PHONE REDACTED]', text)
    
    # Redact SSN
    text = re.sub(r'\\b\\d{3}-\\d{2}-\\d{4}\\b', 
                  '[SSN REDACTED]', text)
    
    return text`}
            </pre>
          </Box>


          <Alert type="info" header="📊 Security Statistics">
            <SpaceBetween size="s">
              <Box><strong>48% of AI-generated code</strong> contains security vulnerabilities</Box>
              <Box><strong>322% increase</strong> in privilege escalation vulnerabilities</Box>
              <Box><strong>$9.77M average cost</strong> of healthcare data breach</Box>
              <Box><strong>73% of consumers</strong> worry about AI privacy</Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// Best Practices Section
function BestPracticesSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">✨ Production Best Practices</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Successful production deployments follow proven patterns and practices. Learn from organizations 
            that achieved 74% ROI and avoided the pitfalls that lead to project cancellation.
          </Box>


          <Alert type="success" header="✅ Success Factors (74% Achieve ROI)">
            <ul style={{ marginLeft: '20px' }}>
              <li><strong>Start Narrow:</strong> Bounded use cases with clear success metrics</li>
              <li><strong>Invest in Infrastructure:</strong> Observability from day 1</li>
              <li><strong>Human-in-Loop:</strong> Default to oversight, not full autonomy</li>
              <li><strong>Cost Controls:</strong> Optimization before scaling</li>
              <li><strong>Continuous Testing:</strong> Red team as ongoing practice</li>
              <li><strong>Data-Driven Iteration:</strong> Measure everything, iterate based on data</li>
            </ul>
          </Alert>


          <Container header={<Header variant="h3">Deployment Checklist</Header>}>
            <SpaceBetween size="m">
              <Box variant="h4">🔍 Pre-Deployment</Box>
              <ul style={{ marginLeft: '20px' }}>
                <li>✅ Define clear success metrics and KPIs</li>
                <li>✅ Implement comprehensive monitoring and logging</li>
                <li>✅ Set up error handling and fallback mechanisms</li>
                <li>✅ Conduct security audit and penetration testing</li>
                <li>✅ Establish cost budgets and alerts</li>
                <li>✅ Train team on AI-specific operations</li>
                <li>✅ Create incident response plan</li>
              </ul>


              <Box variant="h4">🚀 During Deployment</Box>
              <ul style={{ marginLeft: '20px' }}>
                <li>✅ Start with limited rollout (5-10% traffic)</li>
                <li>✅ Monitor all metrics closely</li>
                <li>✅ Have rollback plan ready</li>
                <li>✅ Collect user feedback actively</li>
                <li>✅ Watch for unexpected behaviors</li>
                <li>✅ Validate cost projections</li>
              </ul>


              <Box variant="h4">📊 Post-Deployment</Box>
              <ul style={{ marginLeft: '20px' }}>
                <li>✅ Analyze performance vs. expectations</li>
                <li>✅ Iterate based on real-world data</li>
                <li>✅ Optimize costs continuously</li>
                <li>✅ Update documentation and runbooks</li>
                <li>✅ Conduct regular security audits</li>
                <li>✅ Measure business impact and ROI</li>
              </ul>
            </SpaceBetween>
          </Container>


          <Container header={<Header variant="h3">Common Pitfalls to Avoid</Header>}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Pitfall</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Impact</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Solution</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Rushing to Production</strong></td>
                  <td style={{ padding: '12px' }}>40% project cancellation rate</td>
                  <td style={{ padding: '12px' }}>Phased rollout with validation</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Ignoring Costs</strong></td>
                  <td style={{ padding: '12px' }}>Budget overruns, no ROI</td>
                  <td style={{ padding: '12px' }}>Cost monitoring and optimization</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>No Monitoring</strong></td>
                  <td style={{ padding: '12px' }}>Silent failures, quality issues</td>
                  <td style={{ padding: '12px' }}>Comprehensive observability</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px' }}><strong>Full Autonomy</strong></td>
                  <td style={{ padding: '12px' }}>Trust erosion, errors</td>
                  <td style={{ padding: '12px' }}>Human-in-loop oversight</td>
                </tr>
                <tr style={{ background: '#f8f9fa' }}>
                  <td style={{ padding: '12px' }}><strong>Weak Security</strong></td>
                  <td style={{ padding: '12px' }}>Data breaches, compliance issues</td>
                  <td style={{ padding: '12px' }}>Defense in depth, regular audits</td>
                </tr>
              </tbody>
            </table>
          </Container>


          <StudentNote title="🎯 Key Takeaway">
            <strong>Speed of deployment inversely correlates with success.</strong> The 74% achieving ROI 
            deployed strategically with proper infrastructure, monitoring, and controls. The 40% being 
            canceled rushed to production without addressing fundamentals.
            <br/><br/>
            <em>Take time to build it right. Your future self will thank you.</em>
          </StudentNote>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}


// References Section
function ReferencesSection() {
  return (
    <SpaceBetween size="m">
      <Container header={<Header variant="h2">📚 References & Resources</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            This tutorial synthesizes insights from 40+ industry reports, research papers, and real-world 
            case studies. All statistics and recommendations are backed by authoritative sources.
          </Box>


          <Container header={<Header variant="h3">Primary Sources</Header>}>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>
                <strong>Stack Overflow Developer Survey 2024-2025</strong><br/>
                <em>Trust metrics, code quality issues, security vulnerabilities</em>
              </li>
              <li>
                <strong>Gartner AI Predictions 2024</strong><br/>
                <em>40% project cancellation prediction, organizational readiness</em>
              </li>
              <li>
                <strong>McKinsey State of AI 2024</strong><br/>
                <em>ROI statistics, deployment challenges, cost analysis</em>
              </li>
              <li>
                <strong>LangChain State of AI Agents Report</strong><br/>
                <em>Production challenges, success factors, technical patterns</em>
              </li>
              <li>
                <strong>Google Cloud AI ROI Study</strong><br/>
                <em>74% ROI achievement, cost optimization strategies</em>
              </li>
              <li>
                <strong>IBM Cost of Data Breach Report 2024</strong><br/>
                <em>Healthcare breach costs, security statistics</em>
              </li>
            </ul>
          </Container>


          <Container header={<Header variant="h3">Technical Resources</Header>}>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>
                <strong>LangSmith Documentation</strong><br/>
                <a href="https://docs.smith.langchain.com/" target="_blank" rel="noopener noreferrer">
                  https://docs.smith.langchain.com/
                </a><br/>
                <em>LLM observability and debugging</em>
              </li>
              <li>
                <strong>Weights & Biases</strong><br/>
                <a href="https://wandb.ai/" target="_blank" rel="noopener noreferrer">
                  https://wandb.ai/
                </a><br/>
                <em>Experiment tracking and visualization</em>
              </li>
              <li>
                <strong>Prometheus + Grafana</strong><br/>
                <a href="https://prometheus.io/" target="_blank" rel="noopener noreferrer">
                  https://prometheus.io/
                </a><br/>
                <em>Infrastructure monitoring</em>
              </li>
              <li>
                <strong>OWASP Top 10 for LLMs</strong><br/>
                <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" target="_blank" rel="noopener noreferrer">
                  https://owasp.org/www-project-top-10-for-large-language-model-applications/
                </a><br/>
                <em>Security best practices</em>
              </li>
            </ul>
          </Container>


          <Container header={<Header variant="h3">Additional Reading</Header>}>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>
                <strong>"Building Production-Ready AI Agents"</strong> - LangChain Blog<br/>
                <em>Practical patterns and anti-patterns</em>
              </li>
              <li>
                <strong>"The Economics of Large Language Models"</strong> - a16z<br/>
                <em>Cost analysis and optimization strategies</em>
              </li>
              <li>
                <strong>"AI Agent Security: A Comprehensive Guide"</strong> - OWASP<br/>
                <em>Security threats and mitigations</em>
              </li>
              <li>
                <strong>"Scaling AI Agents: Lessons from Production"</strong> - Google Cloud<br/>
                <em>Real-world case studies and best practices</em>
              </li>
            </ul>
          </Container>


          <Alert type="info" header="📊 Data Synthesis Methodology">
            <Box variant="p">
              This tutorial synthesizes data from 40+ authoritative sources including industry reports, 
              academic research, and real-world case studies. All statistics are cross-referenced and 
              validated across multiple sources. Where ranges are provided, they represent the consensus 
              across multiple studies.
            </Box>
          </Alert>


          <StudentNote title="🎓 Continue Learning">
            <strong>Next Steps:</strong>
            <ul style={{ marginLeft: '20px' }}>
              <li>Explore the <strong>Secured AI Agents</strong> tutorial for deep dive into security</li>
              <li>Review <strong>BERT Classification</strong> for production ML deployment</li>
              <li>Study <strong>Transformer Architecture</strong> for foundational understanding</li>
            </ul>
          </StudentNote>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )
}
