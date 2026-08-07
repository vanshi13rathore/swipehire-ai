import json
import csv
import ast
import os
import datetime
import pandas as pd
import numpy as np

RESULTS_FILE = 'testing/evaluation/raw_results.json'
REPORT_FILE = 'testing/evaluation/evaluation_report.csv'
FAILURE_REPORT_FILE = 'testing/evaluation/failure_analysis.csv'
EXPLAINABILITY_FILE = 'testing/evaluation/explainability_report.csv'
DASHBOARD_FILE = 'testing/evaluation/dashboard.html'
REGRESSION_FILE = 'testing/evaluation/regression_log.csv'

def parse_stringified_list(val):
    if not isinstance(val, str):
        return []
    val = val.strip()
    if not val:
        return []
    if val.startswith('[') and val.endswith(']'):
        try:
            return ast.literal_eval(val)
        except Exception:
            return [val]
    return [x.strip() for x in val.split(',')] if ',' in val else [val]

def calculate_set_metrics(truth_set, pred_set):
    truth = {str(x).lower().strip() for x in truth_set if x}
    pred = {str(x).lower().strip() for x in pred_set if x}
    
    if not truth and not pred:
        return 1.0, 1.0, 1.0, [], []
    if not truth and pred:
        return 0.0, 0.0, 0.0, list(pred), []
    if truth and not pred:
        return 0.0, 0.0, 0.0, [], list(truth)
        
    true_positives = len(truth.intersection(pred))
    false_positives = len(pred - truth)
    false_negatives = len(truth - pred)
    
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    return precision, recall, f1, list(pred - truth), list(truth - pred)

def append_regression(version, skill_acc, mae, avg_latency):
    file_exists = os.path.isfile(REGRESSION_FILE)
    with open(REGRESSION_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Version', 'Date', 'Skill Accuracy', 'ATS MAE', 'Avg Latency (ms)'])
        writer.writerow([version, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), f"{skill_acc:.2%}", f"{mae:.2f}", f"{avg_latency:.2f}"])

def generate_dashboard(metrics_dict, worst_cases, best_cases):
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>SwipeHire AI Evaluation Dashboard</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }}
            .container {{ max-width: 1200px; margin: 0 auto; }}
            h1 {{ color: #38bdf8; text-align: center; margin-bottom: 2rem; }}
            .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem; }}
            .card {{ background: #1e293b; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #334155; text-align: center; }}
            .card h3 {{ margin: 0 0 0.5rem 0; font-size: 1rem; color: #94a3b8; }}
            .card p {{ margin: 0; font-size: 2rem; font-weight: bold; color: #f8fafc; }}
            .card.highlight p {{ color: #38bdf8; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 1rem; background: #1e293b; border-radius: 0.5rem; overflow: hidden; }}
            th, td {{ padding: 1rem; text-align: left; border-bottom: 1px solid #334155; }}
            th {{ background: #0f172a; color: #94a3b8; font-weight: 600; }}
            tr:last-child td {{ border-bottom: none; }}
            .section-title {{ margin-top: 3rem; color: #f8fafc; border-bottom: 2px solid #334155; padding-bottom: 0.5rem; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>SwipeHire AI Evaluation Report</h1>
            <div class="grid">
                <div class="card highlight"><h3>Dataset Size</h3><p>{metrics_dict['total_size']}</p></div>
                <div class="card highlight"><h3>Completed</h3><p>{metrics_dict['processed']}</p></div>
                <div class="card highlight"><h3>Pending</h3><p>{metrics_dict['pending']}</p></div>
                <div class="card"><h3>Avg Gemini Latency</h3><p>{metrics_dict['g_latency']:.0f} ms</p></div>
                <div class="card"><h3>Avg End-to-End Time</h3><p>{metrics_dict['e2e_latency']:.0f} ms</p></div>
            </div>
            
            <h2 class="section-title">Extraction Accuracy</h2>
            <div class="grid">
                <div class="card"><h3>Skill Extraction</h3><p>{metrics_dict['skill_f1']:.1%}</p></div>
                <div class="card"><h3>Experience</h3><p>{metrics_dict['exp_acc']:.1%}</p></div>
                <div class="card"><h3>Education</h3><p>{metrics_dict['edu_acc']:.1%}</p></div>
                <div class="card"><h3>Certification</h3><p>{metrics_dict['cert_acc']:.1%}</p></div>
                <div class="card"><h3>Project</h3><p>{metrics_dict['proj_acc']:.1%}</p></div>
                <div class="card"><h3>Language</h3><p>{metrics_dict['lang_acc']:.1%}</p></div>
                <div class="card"><h3>Keyword Coverage</h3><p>{metrics_dict['key_cov']:.1%}</p></div>
            </div>
            
            <h2 class="section-title">ATS Evaluation (Regression)</h2>
            <div class="grid">
                <div class="card"><h3>ATS MAE</h3><p>{metrics_dict['ats_mae']:.2f}</p></div>
                <div class="card"><h3>ATS RMSE</h3><p>{metrics_dict['ats_rmse']:.2f}</p></div>
                <div class="card"><h3>Pearson Correlation</h3><p>{metrics_dict['ats_pearson']:.2f}</p></div>
            </div>
            
            <h2 class="section-title">Case Analysis</h2>
            <h3>Worst 10 Cases (Lowest ATS Match Error)</h3>
            <table>
                <tr><th>ID</th><th>Target Role</th><th>Expected ATS</th><th>Predicted ATS</th><th>Missing Skills</th></tr>
                {"".join(f"<tr><td>{c['id']}</td><td>{c['role']}</td><td>{c['expected']:.1f}</td><td>{c['predicted']:.1f}</td><td>{c['missing']}</td></tr>" for c in worst_cases)}
            </table>
            
            <h3>Best 10 Cases (Highest ATS Match Accuracy)</h3>
            <table>
                <tr><th>ID</th><th>Target Role</th><th>Expected ATS</th><th>Predicted ATS</th><th>Extracted Skills</th></tr>
                {"".join(f"<tr><td>{c['id']}</td><td>{c['role']}</td><td>{c['expected']:.1f}</td><td>{c['predicted']:.1f}</td><td>{c['skills']}</td></tr>" for c in best_cases)}
            </table>
        </div>
    </body>
    </html>
    """
    with open(DASHBOARD_FILE, 'w') as f:
        f.write(html)

def analyze_results():
    try:
        with open(RESULTS_FILE, 'r') as f:
            results = json.load(f)
    except FileNotFoundError:
        print("Results file not found. Ensure runner.ts has successfully executed.")
        return
        
    report = []
    failure_analysis = []
    explainability = []
    
    all_precisions, all_recalls, all_f1s = [], [], []
    all_kw_precisions, all_kw_recalls, all_kw_f1s = [], [], []
    
    edu_correct = exp_correct = cert_correct = project_correct = lang_correct = 0
    ats_gemini, ats_ground_truth = [], []
    gemini_latencies, e2e_latencies = [], []
    
    processed_count = pending_count = 0
    total_size = len(results)
    
    case_list = []
    
    for row in results:
        if row.get('status') == 'Pending':
            pending_count += 1
            continue
            
        processed_count += 1
        target_role = row.get('target_role', 'Unknown')
        ground_truth = row.get('ground_truth', {})
        gemini = row.get('gemini_response')
        metrics = row.get('metrics', {})
        
        g_lat = metrics.get('gemini_latency_ms', 0)
        e2e_lat = metrics.get('end_to_end_ms', 0)
        if g_lat > 0: gemini_latencies.append(g_lat)
        if e2e_lat > 0: e2e_latencies.append(e2e_lat)
        
        if not gemini or row.get('status') == 'Failed':
            failure_analysis.append({
                'id': row.get('id'),
                'target_role': target_role,
                'failure_type': 'Parsing/API Error',
                'details': row.get('error', 'Unknown Error')
            })
            continue
            
        # Parse ground truth skills
        gt_skills = parse_stringified_list(ground_truth.get('skills', ''))
        gemini_skills = gemini.get('skills', [])
        
        precision, recall, f1, hallucinated, missing = calculate_set_metrics(gt_skills, gemini_skills)
        all_precisions.append(precision)
        all_recalls.append(recall)
        all_f1s.append(f1)
        
        # Parse Language
        gt_lang = parse_stringified_list(ground_truth.get('languages', ''))
        lang_acc = (len(gt_lang) == 0) or any(l.lower() in [s.lower() for s in gemini_skills] for l in gt_lang)
        if lang_acc: lang_correct += 1
        
        # Parse Keywords
        gt_kw = parse_stringified_list(ground_truth.get('keywords', ''))
        kw_p, kw_r, kw_f1, _, _ = calculate_set_metrics(gt_kw, gemini_skills)
        all_kw_precisions.append(kw_p)
        all_kw_recalls.append(kw_r)
        all_kw_f1s.append(kw_f1)
        
        if missing or hallucinated:
            failure_analysis.append({
                'id': row.get('id'),
                'target_role': target_role,
                'failure_type': 'Skill Mismatch',
                'missing_skills': ", ".join(missing),
                'hallucinated_skills': ", ".join(hallucinated)
            })
            
        gt_edu = parse_stringified_list(ground_truth.get('education', ''))
        gemini_edu = gemini.get('education', [])
        edu_accurate = (len(gt_edu) == 0 and len(gemini_edu) == 0) or (len(gt_edu) > 0 and len(gemini_edu) > 0)
        if edu_accurate: edu_correct += 1
        
        gt_exp = parse_stringified_list(ground_truth.get('experience', ''))
        gemini_exp = gemini.get('experience', [])
        exp_accurate = (len(gt_exp) == 0 and len(gemini_exp) == 0) or (len(gt_exp) > 0 and len(gemini_exp) > 0)
        if exp_accurate: exp_correct += 1
        
        gt_certs = parse_stringified_list(ground_truth.get('certifications', ''))
        gemini_certs = gemini.get('certifications', [])
        cert_accurate = (len(gt_certs) == 0 and len(gemini_certs) == 0) or (len(gt_certs) > 0 and len(gemini_certs) > 0)
        if cert_accurate: cert_correct += 1
        
        gemini_projects = gemini.get('projects', [])
        if isinstance(gemini_projects, list): project_correct += 1
        
        gt_ats = 0
        try:
            raw_gt = row.get('dataset_match_score', '0')
            gt_ats = float(str(raw_gt).replace('%', '').strip())
        except Exception:
            pass
            
        g_ats = gemini.get('ai_analysis', {}).get('atsScore', 0)
        ats_ground_truth.append(gt_ats)
        ats_gemini.append(g_ats)
        
        # Explainability
        explainability.append({
            'Resume ID': row.get('id'),
            'Expected Skills': ", ".join(gt_skills),
            'Predicted Skills': ", ".join(gemini_skills),
            'Missing Skills': ", ".join(missing),
            'Extra Skills': ", ".join(hallucinated),
            'Reason for ATS Score': gemini.get('ai_analysis', {}).get('summary', ''),
            'Confidence': 'High' if f1 > 0.8 else 'Medium' if f1 > 0.5 else 'Low'
        })
        
        case_list.append({
            'id': row.get('id'),
            'role': target_role,
            'expected': gt_ats,
            'predicted': g_ats,
            'error': abs(gt_ats - g_ats),
            'missing': ", ".join(missing)[:50] + "...",
            'skills': ", ".join(gemini_skills)[:50] + "..."
        })
        
    # Generate empty metrics if 0 processed
    if processed_count == 0:
        metrics_dict = {
            'total_size': total_size, 'processed': 0, 'pending': pending_count,
            'g_latency': 0, 'e2e_latency': 0, 'skill_f1': 0, 'exp_acc': 0, 'edu_acc': 0, 
            'cert_acc': 0, 'proj_acc': 0, 'lang_acc': 0, 'key_cov': 0, 
            'ats_mae': 0, 'ats_rmse': 0, 'ats_pearson': 0
        }
        generate_dashboard(metrics_dict, [], [])
        print("Dashboard generated for 0 items (Quota limited).")
        return

    # Compute metrics
    ats_gt_np = np.array(ats_ground_truth)
    ats_g_np = np.array(ats_gemini)
    mae = np.mean(np.abs(ats_gt_np - ats_g_np)) if len(ats_gt_np) > 0 else 0
    rmse = np.sqrt(np.mean((ats_gt_np - ats_g_np)**2)) if len(ats_gt_np) > 0 else 0
    pearson_r = np.corrcoef(ats_gt_np, ats_g_np)[0, 1] if len(ats_gt_np) > 1 and np.std(ats_gt_np) > 0 and np.std(ats_g_np) > 0 else 0.0

    skill_f1_mean = np.mean(all_f1s) if all_f1s else 0
    key_cov_mean = np.mean(all_kw_recalls) if all_kw_recalls else 0
    avg_g_lat = np.mean(gemini_latencies) if gemini_latencies else 0

    metrics_dict = {
        'total_size': total_size,
        'processed': processed_count,
        'pending': pending_count,
        'g_latency': avg_g_lat,
        'e2e_latency': np.mean(e2e_latencies) if e2e_latencies else 0,
        'skill_f1': skill_f1_mean,
        'exp_acc': exp_correct / processed_count,
        'edu_acc': edu_correct / processed_count,
        'cert_acc': cert_correct / processed_count,
        'proj_acc': project_correct / processed_count,
        'lang_acc': lang_correct / processed_count,
        'key_cov': key_cov_mean,
        'ats_mae': mae,
        'ats_rmse': rmse,
        'ats_pearson': pearson_r
    }
    
    case_list.sort(key=lambda x: x['error'], reverse=True)
    worst_10 = case_list[:10]
    best_10 = sorted(case_list, key=lambda x: x['error'])[:10]
    
    generate_dashboard(metrics_dict, worst_10, best_10)
    
    pd.DataFrame(explainability).to_csv(EXPLAINABILITY_FILE, index=False)
    pd.DataFrame(failure_analysis).to_csv(FAILURE_REPORT_FILE, index=False)
    
    append_regression("v1.0", skill_f1_mean, mae, avg_g_lat)
    print("Dashboard and Reports generated successfully!")

if __name__ == "__main__":
    analyze_results()
