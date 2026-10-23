import { useEffect, useMemo, useState } from 'react';
import { Activity, Users, Trophy, LayoutDashboard, UserRound, Search, Plus, Pencil, Trash2, Menu, X, Zap, CalendarCheck, ArrowUpRight, Dumbbell, CheckCircle2, AlertCircle } from 'lucide-react';

const API = 'http://localhost:8080/api';
const blank = { fullName: '', age: '', sport: 'Cricket', phone: '', email: '', status: 'Active' };
const sports = ['Cricket', 'Football', 'Basketball', 'Badminton', 'Athletics', 'Tennis', 'Swimming', 'Volleyball'];

export default function App() {
  const [athletes, setAthletes] = useState([]);
  const [stats, setStats] = useState({ totalAthletes: 0, activeAthletes: 0, sportsOffered: 0 });
  const [page, setPage] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [mobileNav, setMobileNav] = useState(false);

  async function load() {
    try {
      const [a, s] = await Promise.all([fetch(`${API}/athletes`), fetch(`${API}/dashboard`)]);
      if (!a.ok || !s.ok) throw new Error('Could not load data from the backend.');
      setAthletes(await a.json()); setStats(await s.json()); setError('');
    } catch { setError('Backend not connected. Start Spring Boot and check your MySQL settings.'); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(''), 2800); return () => clearTimeout(t); } }, [notice]);

  const filtered = useMemo(() => athletes.filter(a =>
    `${a.fullName} ${a.sport} ${a.email} ${a.status}`.toLowerCase().includes(search.toLowerCase())), [athletes, search]);

  function openAdd() { setEditing(null); setForm(blank); setModal(true); }
  function openEdit(a) { setEditing(a.id); setForm({ ...a, age: String(a.age) }); setModal(true); }
  async function save(e) {
    e.preventDefault();
    const payload = { ...form, age: Number(form.age) };
    try {
      const response = await fetch(editing ? `${API}/athletes/${editing}` : `${API}/athletes`, {
        method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Save failed. Check the entered details.');
      setModal(false); setNotice(editing ? 'Athlete details updated.' : 'Athlete registered successfully.'); load();
    } catch (e) { setNotice(e.message || 'Unable to save athlete.'); }
  }
  async function remove(id) {
    if (!window.confirm('Delete this athlete record?')) return;
    try {
      const response = await fetch(`${API}/athletes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setNotice('Athlete removed.'); load();
    } catch { setNotice('Could not delete athlete. Is the backend running?'); }
  }

  const nav = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Athletes', icon: Users },
    { name: 'Sports Programs', icon: Trophy },
    { name: 'Coaches', icon: UserRound },
    { name: 'Attendance', icon: CalendarCheck }
  ];
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Activity size={23}/></div><div><b>ELEVATE<span>.</span></b><small>SPORTS ACADEMY</small></div><button className="close-nav" onClick={() => setMobileNav(false)}><X/></button></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item => <button key={item.name} onClick={() => { setPage(item.name); setMobileNav(false); }} className={`nav-item ${page === item.name ? 'selected' : ''}`}><item.icon size={18}/><span>{item.name}</span>{item.name === 'Athletes' && <span className="nav-count">{athletes.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Zap size={17}/></div><b>Built for champions.</b><p>Train with purpose. Perform with pride.</p><div className="progress"><span/></div><small>ACADEMY MANAGEMENT</small></div><div className="profile"><div className="avatar">SA</div><div><b>Academy Admin</b><small>Administrator</small></div><span className="online-dot"/></div></div>
    </aside>
    {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)} />}
    <main className="main">
      <header className="topbar"><div className="top-left"><button className="menu-button" onClick={() => setMobileNav(true)}><Menu/></button><div><div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div><div className="today">Your academy, one step ahead.</div></div></div><div className="top-right"><span className="live-pill"><i/> SYSTEM ONLINE</span><div className="top-avatar">SA</div></div></header>
      <div className="content">
        {error && <div className="error-banner"><AlertCircle size={17}/>{error}</div>}
        {notice && <div className="notice"><CheckCircle2 size={17}/>{notice}</div>}
        {page === 'Dashboard' ? <>
          <section className="hero"><div className="hero-copy"><div className="eyebrow"><span/> YOUR PERFORMANCE HUB</div><h1>Build champions.<br/><em>Make history.</em></h1><p>Everything you need to manage your academy, develop talent, and take performance to the next level.</p><button className="primary-btn" onClick={() => { setPage('Athletes'); openAdd(); }}><Plus size={17}/> Register an athlete</button></div><div className="hero-art"><div className="hero-circle circle-one"/><div className="hero-circle circle-two"/><div className="hero-number">01<span>/ ELITE</span></div><div className="hero-stamp"><Trophy size={22}/><span>PLAY TO<br/>WIN.</span></div><div className="hero-caption">DISCIPLINE <span>·</span> DEDICATION <span>·</span> DOMINANCE</div></div><div className="hero-index">EA / 2026</div></section>
          <div className="section-heading"><div><div className="eyebrow muted">AT A GLANCE</div><h2>Academy overview</h2></div><span className="updated"><span/> Live data</span></div>
          <section className="stats-grid">
            <Stat icon={Users} label="TOTAL ATHLETES" value={stats.totalAthletes} note="Registered in academy" />
            <Stat icon={Activity} label="ACTIVE ATHLETES" value={stats.activeAthletes} note="Currently training" />
            <Stat icon={Trophy} label="SPORTS PROGRAMS" value={stats.sportsOffered} note="Distinct sports represented" />
            <Stat icon={CalendarCheck} label="ATTENDANCE" value="—" note="Attendance module: next phase" />
          </section>
          <section className="lower-grid"><div className="panel roster-panel"><div className="panel-heading"><div><div className="eyebrow muted">THE TEAM</div><h3>Recently registered</h3></div><button className="text-btn" onClick={() => setPage('Athletes')}>View all <ArrowUpRight size={15}/></button></div>{athletes.length ? <div className="mini-roster">{athletes.slice(-5).reverse().map(a => <div className="mini-row" key={a.id}><div className="person-avatar">{(a.fullName || '?').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()}</div><div className="person-info"><b>{a.fullName}</b><small>{a.sport} · Age {a.age}</small></div><span className={`status ${a.status === 'Active' ? 'active' : 'inactive'}`}>{a.status}</span></div>)}</div> : <Empty onAdd={openAdd}/>}</div>
            <div className="panel programs-panel"><div className="panel-heading"><div><div className="eyebrow muted">FIND YOUR GAME</div><h3>Sports programs</h3></div><Dumbbell size={20} className="panel-icon"/></div><div className="sport-list">{sports.slice(0,6).map((s,i)=><div className="sport-row" key={s}><span className="sport-index">0{i+1}</span><span>{s}</span><span className="sport-arrow">↗</span></div>)}</div><p className="panel-foot">Program list preview · manage athlete sport assignments in Athletes.</p></div></section>
        </> : page === 'Athletes' ? <section className="athletes-page"><div className="page-title-row"><div><div className="eyebrow muted">PEOPLE & PERFORMANCE</div><h1>Athlete roster<span>.</span></h1><p>Manage your talent. Keep every record in peak condition.</p></div><button className="primary-btn" onClick={openAdd}><Plus size={17}/> Add athlete</button></div><div className="toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, sport, email..."/></div><span className="result-count">{filtered.length} ATHLETES</span></div><div className="table-wrap"><table><thead><tr><th>ATHLETE</th><th>SPORT</th><th>AGE</th><th>CONTACT</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map(a=><tr key={a.id}><td><div className="table-person"><div className="person-avatar">{(a.fullName || '?').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()}</div><b>{a.fullName}</b></div></td><td><span className="sport-tag">{a.sport}</span></td><td>{a.age}</td><td><div>{a.email || '—'}</div><small className="phone">{a.phone || ''}</small></td><td><span className={`status ${a.status === 'Active' ? 'active' : 'inactive'}`}>{a.status}</span></td><td><div className="actions"><button title="Edit athlete" onClick={()=>openEdit(a)}><Pencil size={16}/></button><button title="Delete athlete" onClick={()=>remove(a.id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>{!filtered.length && <div className="empty-table"><Users size={28}/><b>No athletes found</b><p>Try another search or register your first athlete.</p><button className="primary-btn" onClick={openAdd}><Plus size={16}/> Add athlete</button></div>}</div></section> : <section className="coming-page"><div className="coming-icon"><Trophy size={30}/></div><div className="eyebrow muted">COMING UP NEXT</div><h1>{page}<span>.</span></h1><p>This section is reserved for the next development phase. The athlete registration, search, edit, delete, dashboard and MySQL integration are ready to demonstrate.</p><button className="primary-btn" onClick={()=>setPage('Athletes')}>Manage athletes <ArrowUpRight size={16}/></button></section>}
        <footer><span>© 2026 ELEVATE SPORTS ACADEMY</span><span>MADE FOR <b>PERFORMANCE.</b></span></footer>
      </div>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><form className="modal" onSubmit={save}><div className="modal-head"><div><div className="eyebrow muted">{editing ? 'UPDATE PROFILE' : 'NEW REGISTRATION'}</div><h2>{editing ? 'Edit athlete' : 'Register athlete'}</h2></div><button type="button" className="icon-btn" onClick={()=>setModal(false)}><X/></button></div><label>Full name<input required minLength="2" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} placeholder="e.g. Arjun Reddy"/></label><div className="form-two"><label>Age<input required type="number" min="5" max="100" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="18"/></label><label>Sport<select value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})}>{sports.map(s=><option key={s}>{s}</option>)}</select></label></div><label>Email address<input type="email" value={form.email || ''} onChange={e=>setForm({...form,email:e.target.value})} placeholder="athlete@example.com"/></label><label>Phone number<input value={form.phone || ''} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 98765 43210"/></label><label>Status<select value={form.status || 'Active'} onChange={e=>setForm({...form,status:e.target.value})}><option>Active</option><option>Inactive</option></select></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setModal(false)}>Cancel</button><button className="primary-btn" type="submit">{editing ? 'Save changes' : 'Register athlete'} <ArrowUpRight size={16}/></button></div></form></div>}
  </div>;
}

function Stat({icon: Icon,label,value,note}) { return <div className="stat-card"><div className="stat-top"><div className="stat-icon"><Icon size={19}/></div><span className="stat-mark">↗</span></div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><div className="stat-note">{note}</div></div>; }
function Empty({onAdd}) { return <div className="empty-roster"><Users size={26}/><b>Your roster starts here.</b><p>Add your first athlete to see the team on your dashboard.</p><button className="secondary-btn" onClick={onAdd}><Plus size={15}/> Add athlete</button></div>; }
