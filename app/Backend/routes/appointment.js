const express = require('express');
const router = express.Router();
const { Appointment, PsikologSchedule, User } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { user_id, schedule_id } = req.body;

    const schedule = await PsikologSchedule.findOne({ where: { id: schedule_id } });
    if (!schedule) {
      return res.status(404).json({ message: 'Jadwal psikolog tidak ditemukan' });
    }

    // Cek apakah kuota masih tersedia
    if (schedule.kuota <= 0) {
      return res.status(400).json({ message: 'Kuota sudah penuh' });
    }

    const checkUser = await User.findByPk(user_id);
    if (!checkUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    //hitung dari jumlah appointment pada jadwal tsb
    const nomorAntrian =
      (await Appointment.count({
        where: { schedule_id: schedule_id },
      })) + 1;

    // Simpan appointment
    const appointment = await Appointment.create({
      user_id,
      schedule_id,
      status: 'Pending',
      nomor_antrian: nomorAntrian,
    });

    // Update kuota jadwal (decrement 1)
    const newKuota = schedule.kuota - 1;
    let newStatus = schedule.status;

    // Jika kuota habis, ubah status jadi 'penuh'
    if (newKuota <= 0) {
      newStatus = 'penuh';
    }

    await schedule.update({
      kuota: newKuota,
      status: newStatus,
    });

    res.status(201).json({
      message: 'Appointment berhasil dibuat',
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});

router.delete('/cancel', async (req, res) => {
  try {
    const { appointment_id, user_id } = req.body;
    if (!appointment_id) {
      return res.status(400).json({ message: 'appointment_id wajib diisi' });
    }
    const appointment = await Appointment.findOne({ where: { id: appointment_id, user_id: user_id, status: 'Pending' } });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const schedule = await PsikologSchedule.findOne({ where: { id: appointment.schedule_id } });
    // Update kuota jadwal (increment 1)
    const newKuota = schedule.kuota + 1;
    let newStatus = schedule.status;

    if (newKuota > 0) {
      newStatus = 'tersedia';
    }

    await schedule.update({
      kuota: newKuota,
      status: newStatus,
    });
    await Appointment.destroy({ where: { id: appointment_id } });

    res.status(200).json({ message: 'Appointment berhasil dibatalkan' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await Appointment.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const totalKonsul = await Appointment.count({ where: { user_id: user_id, status: 'Selesai' } });
    const konsulSelanjutnya = await Appointment.findOne({
      where: { user_id: user_id, status: 'Pending' },
      include: {
        model: PsikologSchedule,
        as: 'schedule',
      },
    });

    const data = await Appointment.findAll({ where: { user_id: user_id } });
    res.status(200).json({
      totalKonsul: totalKonsul,
      konsulSelanjutnya: {
        date: konsulSelanjutnya.schedule.date,
        start_time: konsulSelanjutnya.schedule.start_time,
        end_time: konsulSelanjutnya.schedule.end_time,
      },
      data: data,
    });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
module.exports = router;
