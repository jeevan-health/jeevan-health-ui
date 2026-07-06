import { useState } from 'react';
import { X, Drop, Clock, House, Phone, Flask, Info, Heart, Microscope, Shield, ShoppingCart, Plus, CaretDown, Warning, FileText, ChartBar, Heartbeat, Coin, ArrowClockwise, User, Lightbulb } from '@phosphor-icons/react';
import testDetailData from './testDetailData';
import { getTestEducation, getPackageEducation } from '../../utils/testEducation';

const iconMap = {
  Lightbulb, User: User, Warning, Drop, Microscope, FileText, ChartBar, Heartbeat, Shield, Coin: Coin, ArrowClockwise, Clock, Info, Heart, Phone,
};

const TestDetailModal = ({ test, onClose, combo, addComboToCart, alsoBooked = [], onAddAlsoBooked }) => {
  if (!test) return null;
  const isPackage = test.subcategory === 'Health Packages';
  const data = testDetailData[test.name] || null;
  const education = isPackage ? getPackageEducation(test) : getTestEducation(test);
  const [openFaq, setOpenFaq] = useState({});

  const Section = ({ title, icon: Icon, children, color = '#0F5DA8' }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {Icon && <Icon size={18} weight="fill" color={color} />}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-dark)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const Pill = ({ label, bg = '#e8f0fe', color = '#0F5DA8' }) => (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, background: bg, color, margin: '2px 4px 2px 0' }}>{label}</span>
  );

  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', overflowY: 'auto', padding: '20px 10px', display: 'flex', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, maxWidth: 720, width: '100%', padding: '24px 20px', position: 'relative', margin: 'auto' }}>
        <button onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: '#f5f5f5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <X size={16} />
        </button>

        {/* Test Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Drop size={24} weight="fill" color="#c62828" />
          </div>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>{test.name}</h2>
            {test.subcategory && <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500, marginTop: 2 }}>{test.subcategory}</p>}
          </div>
        </div>

        {/* Also Referred As */}
        {data?.alsoKnownAs && (
          <Section title="Also Referred As" icon={Info}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {data.alsoKnownAs.map((a, i) => <Pill key={i} label={a} />)}
            </div>
          </Section>
        )}

        {/* Applicable For */}
        {data?.applicableFor && (
          <Section title="Applicable For" icon={Heart}>
            <Pill label={data.applicableFor.gender} bg="#fce4ec" color="#c62828" />
            <Pill label={data.applicableFor.age} bg="#e8f5e9" color="#2e7d32" />
            {data.applicableFor.conditions.map((c, i) => <Pill key={i} label={c} bg="#fff3e0" color="#e65100" />)}
          </Section>
        )}

        {/* Report Time */}
        <Section title="Report Time" icon={Clock} color="#e65100">
          <div style={{ background: '#fff8e1', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#e65100' }}>
            {test.report_time ? `Within ${test.report_time}` : 'Varies by lab location'}
          </div>
        </Section>

        {/* Test Details */}
        <Section title="Test Details" icon={Flask}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Contains:</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{isPackage ? (test.description?.match(/(\d+)\+?\s*(parameters|tests|params)/i)?.[0] || 'Multiple parameters') : '1 Test'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Sample Type:</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{data?.sampleType || 'Blood Sample'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Home Collection:</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32' }}>
              {test.home_collection !== false ? 'Yes' : 'Lab visit preferred'}
            </div>
          </div>
        </Section>

        {/* Overview */}
        <Section title="KNOW MORE ABOUT THIS TEST" icon={Microscope}>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-body)' }}>{test.description}</p>
        </Section>

        {/* Why This Test is Booked */}
        {data?.symptoms && (
          <Section title="WHY THIS TEST IS BOOKED" icon={Heart} color="#c62828">
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 8 }}>You may need this test if you have:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              {data.symptoms.map((s, i) => <Pill key={i} label={s} bg="#fce4ec" color="#c62828" />)}
            </div>
            {data.riskConditions && (
              <>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 8 }}>High Risk Conditions:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {data.riskConditions.map((r, i) => <Pill key={i} label={r} bg="#ffebee" color="#b71c1c" />)}
                </div>
              </>
            )}
          </Section>
        )}

        {/* When Should You Take This Test */}
        {data?.whenToTake && (
          <Section title="WHEN SHOULD YOU TAKE THIS TEST?" icon={Clock} color="#1565c0">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.whenToTake.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                  <span style={{ color: '#1565c0', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: 'var(--text-body)' }}>{w}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Combo Upsell */}
        {combo && combo.items.length >= 2 && (
          <Section title="FREQUENTLY BOOKED TOGETHER" icon={ShoppingCart} color="#FF8A00">
            <div style={{ background: '#fff8e1', borderRadius: 12, padding: 16, border: '1px solid #ffecb3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e65100' }}>{combo.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#2e7d32', background: '#c8e6c9', padding: '2px 8px', borderRadius: 4 }}>{combo.saveLabel}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                {combo.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: '#0F5DA8', fontWeight: 600 }}>{item.name}</span>
                    <span>
                      <span style={{ fontWeight: 600, color: i === 0 ? '#0F5DA8' : 'var(--text-dark)' }}>₹{item.offerPrice || item.price}</span>
                      {item.mrp && item.mrp > (item.offerPrice || item.price) && (
                        <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 3 }}>₹{item.mrp}</span>
                      )}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed #ddd', marginTop: 4, paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Combo Price</span>
                  <span style={{ fontWeight: 700, color: '#e65100' }}>₹{combo.comboPrice}</span>
                </div>
                {combo.savings > 0 && (
                  <div style={{ fontSize: 12, color: '#2e7d32', fontWeight: 600 }}>
                    You save ₹{combo.savings}
                  </div>
                )}
              </div>
              <button onClick={() => addComboToCart(combo.items)}
                style={{
                  width: '100%', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', color: '#fff',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                Add All to Cart — ₹{combo.comboPrice}
              </button>
            </div>
          </Section>
        )}

        {/* Also Booked */}
        {alsoBooked.length > 0 && (
          <Section title="ALSO BOOKED BY OTHERS" icon={Plus} color="#0F5DA8">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {alsoBooked.map((item, i) => (
                <button key={i} onClick={() => onAddAlsoBooked(item)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                    background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#d0e2ff'}
                  onMouseLeave={e => e.currentTarget.style.background = '#e8f0fe'}>
                  <Plus size={14} weight="bold" />
                  {item.name}
                  <span>
                    <span style={{ fontWeight: 700 }}>₹{item.offerPrice || item.price}</span>
                    {item.mrp && item.mrp > (item.offerPrice || item.price) && (
                      <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 3 }}>₹{item.mrp}</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Sample Collection */}
        <Section title="SAMPLE COLLECTION" icon={Drop} color="#1565c0">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-light)' }}>Sample Type:</span>
            <span style={{ fontWeight: 600 }}>{data?.sampleType || 'Blood (Vein sample)'}</span>
            <span style={{ color: 'var(--text-light)' }}>Collection Method:</span>
            <span style={{ fontWeight: 600 }}>{data?.collectionMethod || 'Home visit or lab visit'}</span>
            <span style={{ color: 'var(--text-light)' }}>Collected by:</span>
            <span style={{ fontWeight: 600 }}>Certified Phlebotomist</span>
          </div>
        </Section>

        {/* Preparation */}
        <Section title="PREPARATION" icon={Info} color="#e65100">
          <div style={{ background: '#fff8e1', padding: '10px 14px', borderRadius: 8, fontSize: 13, lineHeight: 1.6 }}>
            {data?.preparation || test.preparation_instructions || 'No special preparation required'}
          </div>
        </Section>

        {/* How Test is Done */}
        {data?.procedure && (
          <Section title="HOW TEST IS DONE" icon={Microscope}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.procedure.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                  <span style={{ color: '#0F5DA8', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: 'var(--text-body)' }}>{step}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* What Results Mean */}
        {data?.normalRange && (
          <Section title="WHAT THE RESULTS MEAN" icon={Shield} color="#2e7d32">
            {data.normalRange.sections.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: i % 2 === 0 ? '#f8f9fa' : '#fff', borderRadius: 6, marginBottom: 4, fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-dark)', flex: 1 }}>{s.label}</span>
                <span style={{ color: s.label === 'Normal' || s.label === 'Sufficient' || s.label === 'Desirable' || s.label === 'Normal Sinus Rhythm' || s.label === 'Negative' ? '#2e7d32' : s.label === 'Prediabetes' || s.label === 'Borderline' || s.label === 'Insufficient' ? '#e65100' : s.label === 'Diabetes' || s.label === 'Deficient' || s.label === 'High' || s.label === 'Elevated' || s.label === 'Positive' || s.label === 'Abnormal' ? '#c62828' : 'var(--text-dark)', fontWeight: 600, textAlign: 'right' }}>
                  {s.male !== 'N/A' ? s.male : s.female}
                </span>
              </div>
            ))}
            {data.normalRange.note && (
              <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 8, fontStyle: 'italic' }}>{data.normalRange.note}</p>
            )}
          </Section>
        )}

        {/* Interpretation */}
        {data?.interpretation && (
          <Section title="INTERPRETATION">
            <div style={{ padding: '8px 12px', background: '#e8f5e9', borderRadius: 6, marginBottom: 4, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: '#2e7d32' }}>Normal: </span>
              <span style={{ color: 'var(--text-body)' }}>{data.interpretation.normal}</span>
            </div>
            <div style={{ padding: '8px 12px', background: '#ffebee', borderRadius: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: '#c62828' }}>Abnormal: </span>
              <span style={{ color: 'var(--text-body)' }}>{data.interpretation.abnormal}</span>
            </div>
          </Section>
        )}

        {/* Related Tests */}
        {data?.relatedTests && (
          <Section title="RELATED TESTS" icon={Flask}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {data.relatedTests.map((r, i) => <Pill key={i} label={r} bg="#f3e5f5" color="#7b1fa2" />)}
            </div>
          </Section>
        )}

        {/* Home Sample Collection */}
        <Section title="HOME SAMPLE COLLECTION" icon={House} color="#2e7d32">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13 }}>
            {['Easy online booking', 'Doorstep sample collection', 'Live tracking of phlebotomist', 'Safe & hygienic procedure', 'Digital reports via WhatsApp & Email'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2e7d32', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-body)' }}>{item}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Report Delivery */}
        <Section title="REPORT DELIVERY" icon={Clock} color="#1565c0">
          <div style={{ background: '#e3f2fd', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#1565c0' }}>
            Usually within {test.report_time || '12-24 hours'} — Faster in metro cities
          </div>
        </Section>

        {/* Benefits */}
        {data?.benefits && (
          <Section title="BENEFITS OF THIS TEST" icon={Shield} color="#2e7d32">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13 }}>
              {data.benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#2e7d32', fontWeight: 700 }}>✓</span>
                  <span style={{ color: 'var(--text-body)' }}>{b}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Limitations */}
        {data?.limitations && (
          <Section title="LIMITATIONS" icon={Info} color="#e65100">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
              {data.limitations.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ color: '#e65100', fontWeight: 700, flexShrink: 0 }}>⚠</span>
                  <span style={{ color: 'var(--text-body)' }}>{l}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* When to Consult Doctor */}
        <Section title="WHEN TO CONSULT DOCTOR" icon={Phone} color="#c62828">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            {['Test result is above or below normal range', 'Symptoms of the condition are present', 'Sudden fatigue or unexplained weight changes', 'Need help interpreting your report'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ color: '#c62828', fontWeight: 700, flexShrink: 0 }}>→</span>
                <span style={{ color: 'var(--text-body)' }}>{item}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Safety & Risks */}
        <Section title="SAFETY & RISKS" icon={Shield} color="#0F5DA8">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            {['Minimal pain during blood draw', 'Rare bruising at puncture site', 'Extremely safe procedure'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#0F5DA8', fontWeight: 700 }}>✓</span>
                <span style={{ color: 'var(--text-body)' }}>{item}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Lifestyle Guidance (generic) */}
        <Section title="LIFESTYLE GUIDANCE" icon={Heart} color="#2e7d32">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13 }}>
            {['Balanced low-sugar diet', 'Regular exercise (30 min daily)', 'Stress control and meditation', 'Proper sleep cycle (7-8 hours)', 'Regular health checkups', 'Stay hydrated'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2e7d32', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-body)' }}>{item}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ Accordion */}
        {education.length > 0 && (
          <Section title={isPackage ? "HEALTH PACKAGE FAQ" : "FREQUENTLY ASKED QUESTIONS"} icon={FileText} color={isPackage ? "#0F5DA8" : "#7b1fa2"}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {education.map((section, si) => {
                const Icon = iconMap[section.icon] || Info;
                const isOpen = openFaq[si];
                const pkgBg = isPackage ? '#eef5ff' : '#f3f0ff';
                const pkgOpen = isOpen ? (isPackage ? '#dceaff' : '#f3f0ff') : '#fff';
                const pkgContent = isPackage ? '#f5f9ff' : '#faf9ff';
                return (
                  <div key={si} style={{ border: isPackage ? '1px solid #b3d4ff' : '1px solid #e8e8e8', borderRadius: 10, overflow: 'hidden' }}>
                    <button onClick={() => setOpenFaq(p => ({ ...p, [si]: !p[si] }))}
                      style={{
                        width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: isOpen ? pkgBg : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        fontSize: 13, fontWeight: 700, color: section.color, transition: 'background 0.15s',
                      }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon size={16} weight="fill" color={section.color} />
                        {section.title}
                        <span style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 400 }}>({section.items.length} questions)</span>
                      </span>
                      <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '4px 14px 14px', background: pkgContent }}>
                        {section.items.map((item, ii) => (
                          <div key={ii} style={{ padding: '8px 0', borderBottom: ii < section.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4 }}>{item.q}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-body)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.a}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Book Test CTA */}
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={onClose}
            style={{
              width: '100%', padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', color: '#fff',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>
            {isPackage ? 'Book This Package' : 'Book This Test'} — ₹{test.offerPrice || test.price}
          </button>
          <button onClick={onClose}
            style={{
              width: '100%', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
            Talk to a Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDetailModal;
